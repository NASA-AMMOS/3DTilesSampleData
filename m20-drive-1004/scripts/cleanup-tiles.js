#!/usr/bin/env node
import fs from 'fs';
import url from 'url';
import path from 'path';
import { globSync } from 'glob';
import yargs from 'yargs';

// working directories
const __filename = url.fileURLToPath( import.meta.url );
const __dirname = path.dirname( __filename );

// cli arguments
const { directory = 'tiles' } = yargs( process.argv ).argv;

// remove unused images and json files
const tilesPath = path.resolve( __dirname, `../${ directory }` );
globSync( path.resolve( tilesPath, '**/*_index.png' ).replace( /\\/g, '/' ) )
    .forEach( p => {

        fs.rmSync( p );

    } );

globSync( path.resolve( tilesPath, '**/*_message.json' ).replace( /\\/g, '/' ) )
    .forEach( p => {

        fs.rmSync( p );

    } );