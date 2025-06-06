const fs = require('fs');
const path = require('path');
const assert = require('node:assert/strict');
const { test } = require('node:test');

const components = [
  'src/components/cover.tsx',
  'src/components/editor.tsx',
  'src/components/icon-picker.tsx',
  'src/components/modals/confirm-modal.tsx',
  'src/components/modals/cover-image-modal.tsx',
  'src/components/modals/settings-modal.tsx',
  'src/components/modals/user-settings-modal.tsx',
  'src/components/mode-toggle.tsx',
  'src/components/providers/convex-provider.tsx',
  'src/components/providers/modal-provider.tsx',
  'src/components/providers/store-contextprovider.tsx',
  'src/components/providers/theme-provider.tsx',
  'src/components/search-command.tsx',
  'src/components/single-image-dropzone.tsx',
  'src/components/spinner.tsx',
  'src/components/toolbar.tsx',
  'src/components/ui/alert-dialog.tsx',
  'src/components/ui/avatar.tsx',
  'src/components/ui/button.tsx',
  'src/components/ui/command.tsx',
  'src/components/ui/dialog.tsx',
  'src/components/ui/dropdown-menu.tsx',
  'src/components/ui/input.tsx',
  'src/components/ui/label.tsx',
  'src/components/ui/popover.tsx',
  'src/components/ui/skeleton.tsx',
];

for (const file of components) {
  test(`Component file ${file} should exist`, () => {
    const exists = fs.existsSync(path.join(__dirname, '..', file));
    assert.ok(exists, `Expected ${file} to exist`);
  });
}
