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

### Downloading Data

1. Navigate to the [PDS Imaging Archive Explorer](https://pds-imaging.jpl.nasa.gov/beta/archive-explorer?mission=mars_2020).
2. Select the desired Sol directories to process from the `m2020_navcam_ops_mesh` bundle and download them using a `curl` or `wget` script.
3. Do the same for the same directories in the `m2020_navcam_ops_calibrated` and `m2020_navcam_ops_calibrated` bundles.
4. Move all downloaded directories into the `raw` directory.
5. Run the scripts.

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

## Building Landform

**Installation**
- Pull the [NASA-AMMOS/Landform](https://github.com/NASA-AMMOS/Landform)
- Install [Visual Studio 2022](https://visualstudio.microsoft.com/vs/)
- Install VS 2019 redistributable from VS installer
- Install VS 2013 redistributable from VS installer
- Install [C# 4.8 "developer pack"](https://dotnet.microsoft.com/en-us/download/dotnet-framework/net48)
- Open the Visual Studio Solution
 
**Dependencies**
- Open the package manager console from "Tools > Nuget Package Manager > Package Mangager Console"
- Run "update-package -reinstall"
- Possibly replace GDalConfiguration.cs file when asked (git reset and try without replacing if it doesn't work)
- Respond "N" when asked to update LGPL license files

**Build**
- Run a debug and release build from the Visual Studio UI
- “Landform/Landform/bin/Release/Landform.exe” is available for execution
- Alias the executable to `Landform` or add the directory to the Windows path so it can be called directly
