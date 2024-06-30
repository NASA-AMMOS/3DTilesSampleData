#!/usr/bin/env node
import { execSync } from 'child_process';
import path from 'path';
import url from 'url';
import fs from 'fs';
import yargs from 'yargs';
import { globSync } from 'glob';

// working directories
const __filename = url.fileURLToPath( import.meta.url );
const __dirname = path.dirname( __filename );

// cli args
const {

    // directory to convert files in
    directory = 'tiles',

    // whether to remove all other files other than the extracted images
    removeOther = false,

} = yargs( process.argv ).argv;

const rawPath = path.resolve( __dirname, `../${ directory }` );
const imagePaths = new Set();
globSync( path.resolve( rawPath, '**/*.b3dm' ).replace( /\\/g, '/' ) )
    .forEach( p => {

        // prepare paths
        const glbPath = p.replace( /b3dm$/i, 'glb' );
        const gltfPath = p.replace( /b3dm$/i, 'gltf' );
        const binPath = p.replace( /b3dm$/i, 'bin' );
        const pngPath = p.replace( /b3dm$/i, 'png' );
        const defaultImageName = path.resolve( path.dirname( p ), 'baseColor.png' );

        // read the b3dm bytes
        let b3dmBytes = fs.readFileSync( p );
        b3dmBytes = Uint8Array.prototype.slice.call( b3dmBytes );

        // find the offset to the glb data. Code from:
        // https://github.com/NASA-AMMOS/3DTilesRendererJS/blob/2e0c4e0b199aa9d3a1e7e3a81cd07dc497afb018/src/base/loaders/B3DMLoaderBase.js#L8 
		const dataView = new DataView( b3dmBytes.buffer );
		const byteLength = dataView.getUint32( 8, true );
		const featureTableJSONByteLength = dataView.getUint32( 12, true );
		const featureTableBinaryByteLength = dataView.getUint32( 16, true );
		const batchTableJSONByteLength = dataView.getUint32( 20, true );
		const batchTableBinaryByteLength = dataView.getUint32( 24, true );
		const featureTableStart = 28;
		const batchTableStart = featureTableStart + featureTableJSONByteLength + featureTableBinaryByteLength;
		const glbStart = batchTableStart + batchTableJSONByteLength + batchTableBinaryByteLength;

        // write out the glb file
		const glbBytes = new Uint8Array( b3dmBytes.buffer, glbStart, byteLength - glbStart );
        fs.writeFileSync( glbPath, glbBytes.slice() );

        // convert the glb to gltf to separate the images, rename the image to match the orginal file name,
        // and remove any extraneous files from conversion 
        execSync( `gltf-transform copy ${ glbPath } ${ gltfPath }` );
        fs.renameSync( defaultImageName, pngPath );
        fs.rmSync( gltfPath );
        fs.rmSync( glbPath );
        fs.rmSync( binPath );

        // save the png path so we don't delete it later
        imagePaths.add( pngPath );
    
    } );

if ( removeOther ) {

    // remove any tileset files not from the output images
    globSync( path.resolve( rawPath, '**/*' ).replace( /\\/g, '/' ) )
        .filter( p => /\..+/.test( p ) )
        .filter( p => ! imagePaths.has( p ) )
        .forEach( p => {

            fs.rmSync( p );

        } );

}
