#!/usr/bin/env node
import fs from 'fs';
import url from 'url';
import path from 'path';
import yargs from 'yargs';

// working directories
const __filename = url.fileURLToPath( import.meta.url );
const __dirname = path.dirname( __filename );

// cli args
const {

    // string to look for in the images such as "RUF" or "SLP"
    type = null,

} = yargs( process.argv ).argv;

// find all files in the "objs" directory
const objPath = path.resolve( __dirname, '../objs' );
const files = fs.readdirSync( objPath );
const objs = files.filter( n => /\.obj$/i.test( n ) ).sort();
let imgs = files.filter( n => /\.img$/i.test( n ) ).sort();
if ( type !== null ) {

    // remove any images that don't match the target type
    imgs = imgs.filter( n => n.includes( type ) );

}

objs.forEach( ( n, i ) => {
  
    // find the image associated with the OBJ
    const imgName = n.replace( /\.obj$/i, '.IMG' );
    if ( imgs.indexOf( imgName ) === - 1 ) {

        // if we don't have an exact name match then find the one that matches best with the fewest
        // different characters in the name
        const beginning = imgName.substring( 0, 19 );
        const sortedMatches = imgs
            .filter( n => n.indexOf( beginning ) !== - 1 )
            .sort( ( a, b ) => {

                const result = getDifferentCharacters( imgName, a ) - getDifferentCharacters( imgName, b );
                if ( result === 0 ) {

                    if ( a > b ) return 1;
                    if ( a < b ) return - 1;
                    return 0;

                } else {

                    return result;

                }

            } );

        if ( sortedMatches.length !== 0 ) {

            console.log();
            console.log( 'missing     : ', imgName );
            console.log( 'copying from: ', sortedMatches[ 0 ] );

            fs.copyFileSync( path.resolve( objPath, sortedMatches[ 0 ] ), path.resolve( objPath, imgName ) );

        } else {

            console.log();
            console.log( 'missing with no match: ', imgName );

        }

    }
    
} );

function getDifferentCharacters( a, b ) {

    let count = Math.abs( a.length - b.length );
    for ( let i = 0, l = Math.min( a.length, b.length ); i < l; i ++ ) {

        if ( a[ i ] !== b[ i ] ) {

            count ++;

        }

    }

    return count;

}
