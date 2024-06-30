import { execSync } from 'child_process';
import path from 'path';
import url from 'url';
import yargs from 'yargs';

const {
    
    // the type of images to use (ie RUF or SLP)
    type = null,

    // the directory to output the tileset to
    output = 'tiles',

    // whether to convert the tileset to just images and remove everything else
    imagesOnly = false,
} = yargs( process.argv ).argv;

const __filename = url.fileURLToPath( import.meta.url );
const __dirname = path.dirname( __filename );

const typeArg = `--type=${ type }`;

console.log( 'MOVING FILES' );
execSync( `node ${ path.resolve( __dirname, './move-raw-files.js' ) }`, { stdio: 'inherit' } );

console.log( 'FIXING IMAGES' );
execSync( `node ${ path.resolve( __dirname, './fix-missing-img.js' ) } ${ typeArg }`, { stdio: 'inherit' } );

console.log( 'RUNNING LANDFORM' );
execSync( `node ${ path.resolve( __dirname, './run-landform.js' ) } --output=${ output }`, { stdio: 'inherit' } );

console.log( 'CLEANING UP TILES' );
execSync( `node ${ path.resolve( __dirname, './cleanup-tiles.js' ) } --directory=${ output }`, { stdio: 'inherit' } );

if ( imagesOnly ) {

    console.log( 'ETRACTING IMAGES' );
    execSync( `node ${ path.resolve( __dirname, './extract-textures.js' ) } --directory=${ output } --remove-other`, { stdio: 'inherit' } );

}
