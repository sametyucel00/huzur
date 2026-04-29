const fs = require("fs");
const path = require("path");

function findRepoRoot(startDir) {
  let current = startDir;
  while (current && current !== path.dirname(current)) {
    if (fs.existsSync(path.join(current, "package.json")) && fs.existsSync(path.join(current, "apps"))) {
      return current;
    }
    current = path.dirname(current);
  }
  return startDir;
}

function replaceOnce(content, from, to, filePath) {
  if (!content.includes(from)) {
    return content;
  }
  console.log(`[patch-expo-iap] Patching ${path.relative(process.cwd(), filePath)}`);
  return content.replace(from, to);
}

const repoRoot = findRepoRoot(process.cwd());
const expoIapRoot = path.join(repoRoot, "node_modules", "expo-iap");

if (!fs.existsSync(expoIapRoot)) {
  console.log("[patch-expo-iap] expo-iap is not installed, skipping.");
  process.exit(0);
}

const patches = [
  {
    file: path.join(expoIapRoot, "ios", "ExpoIapModule.swift"),
    replacements: [
      {
        from: `        Constant("ERROR_CODES") {
            OpenIapSerialization.errorCodes()
        }`,
        to: `        Constants {
            ["ERROR_CODES": OpenIapSerialization.errorCodes()]
        }`,
      },
    ],
  },
  {
    file: path.join(expoIapRoot, "ios", "onside", "OnsideIapModule.swift"),
    replacements: [
      {
        from: `        Constant("ERROR_CODES") {
            OpenIapSerialization.errorCodes()
        }

        Constant("IS_ONSIDE_KIT_INSTALLED_IOS") {
            false
        }`,
        to: `        Constants {
            [
                "ERROR_CODES": OpenIapSerialization.errorCodes(),
                "IS_ONSIDE_KIT_INSTALLED_IOS": false
            ]
        }`,
      },
    ],
  },
];

for (const patch of patches) {
  if (!fs.existsSync(patch.file)) {
    console.log(`[patch-expo-iap] Missing ${path.relative(repoRoot, patch.file)}, skipping.`);
    continue;
  }

  let content = fs.readFileSync(patch.file, "utf8");
  const before = content;

  for (const replacement of patch.replacements) {
    content = replaceOnce(content, replacement.from, replacement.to, patch.file);
  }

  if (content !== before) {
    fs.writeFileSync(patch.file, content);
  }
}
