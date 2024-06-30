#!/usr/bin/env node
import fs from 'fs';
import url from 'url';
import path from 'path';
import { globSync } from 'glob';

// working directories
const __filename = url.fileURLToPath( import.meta.url );
const __dirname = path.dirname( __filename );

const rawPath = path.resolve( __dirname, '../raw' );
const objPath = path.resolve( __dirname, '../objs' );

// remove the existing objs directory to work fresh
fs.rmSync( objPath, { recursive: true, force: true } );

// moves all non-vce files with a file extension to the "objs" directory from "raw"
globSync( path.resolve( rawPath, '**/*' ).replace( /\\/g, '/' ) )
    .filter( p => ! /vce/i.test( p ) )
    .filter( p => /\..+/.test( p ) )
    .forEach( file => {

        const fileName = path.basename( file );
        const targetPath = path.resolve( objPath, fileName );

        fs.mkdirSync( path.dirname( targetPath ), { recursive: true } );
        if ( ! fs.existsSync( targetPath ) ) {

            fs.copyFileSync( file, targetPath );

        } else {

            // this should never happen
            console.log( 'OVERWRITING!' );

        }

    } );