#!/usr/bin/env node
import fs from 'fs';
import url from 'url';
import path from 'path';
import { execSync } from 'child_process';
import yargs from 'yargs';

const {

    // the directory to output the tilesets to
    output = 'tiles',

} = yargs( process.argv ).argv;

// working directories
const __filename = url.fileURLToPath( import.meta.url );
const __dirname = path.dirname( __filename );

const objPath = path.resolve( __dirname, '../objs' );
const tilesPath = path.resolve( __dirname, `../${ output }` );

// get the list of OBJs to provide to the landform executable
const objs = fs
    .readdirSync( objPath )
    .filter( f => /\.obj$/.test( f ) )
    .map( f => path.resolve( objPath, f ).replace( /\\/g, '/' ) );

const cmd = `Landform process-tactical --inputpath ${ objs.join( ',' ) }/ --outputfolder ${ tilesPath } --mission M2020 --meshregex auto_obj`;

fs.mkdirSync( tilesPath, { recursive: true } );
execSync( cmd, { stdio: 'inherit' } );
