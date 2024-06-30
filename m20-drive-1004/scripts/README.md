# Processing Scripts

## Scripts

### Versions

- Landform @ 1ce602c5d75da0d1bca8ef5e1f299f908062f397
- node @ v18.20.3
- npm @ v10.7.0
- gltf-transform @ v4.0.2

### Folder Structure

All working directories are assumed to be sibling folders to "/scripts".

- `raw` directory: Folder with merged raw files downloaded from the PDS archive. Immediate child folders are number Sol directories.
- `objs` directory: Working folder for the scripts into which all working products are copied.

### Running

Generating a set of tilesets from the original color products into the "../tiles" folder.

```sh
node ./scripts/run-pipeline.js
```

Generating a set of alternate images using the roughness products into the "../roughness-textures" folder.

```sh
node ./scripts/run-pipeline.js --output=rough-textures --type=RUF --images-only
```

**arguments**

- `output`: the name of the folder to output the final data into.
- `type`: the type of image product to use for the tilesets surface color.
- `images-only`: whether to extract the images from each tileset tile and remove all other tileset data.

