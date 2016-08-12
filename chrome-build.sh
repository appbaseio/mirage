# Add manifest.json
git add manifest.json
git commit -m "bump chrome extension version"
git push origin chrome-extension
# remove old versions
rm -rf ./mirage-unpacked
rm -rf ./mirage.zip
mkdir mirage-unpacked
# Create unpacked version
cp -r site chrome-specific ./manifest.json ./mirage-unpacked
# Create archive
zip -r mirage.zip site chrome-specific ./manifest.json