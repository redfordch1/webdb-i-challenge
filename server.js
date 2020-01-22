const express = require( 'express' );

const db = require( './data/dbConfig.js' );

const server = express();

server.use( express.json() );

server.get( '/', ( req, res ) => {
    db.select( '*' ).from( 'accounts' )
        .then( accounts => {
            console.log( 'accounts: ', accounts );
            res.status( 200 ).json( accounts );
        } )
        .catch( error => {
            console.log( error );
            res.status( 500 ).json( {
                error: 'Error retrieving the accounts.'
            } );
        } );
} );

server.get( '/:id', ( req, res ) => {
    const { id } = req.params;
    db
        .select( '*' )
        .from( 'accounts' )
        .where( { id } )
        .first()
        .then( account => {
            console.log( 'account: ', account );
            res.status( 200 ).json( account );
        } )
        .catch( error => {
            console.log( error );
            res.status( 500 ).json( {
                error: 'Error retrieving the account.'
            } );
        } );
} );

server.post( '/', ( req, res ) => {
    const accountData = req.body;
    db( 'accounts' )
        .insert( accountData, 'id' )
        .then( ids => {
            const [ id ] = ids;
            return db( 'accounts' )
                .select( 'id', 'name', 'budget' )
                .where( { id } )
                .first()
                .then( account => {
                    res.status( 201 ).json( account )
                } )
        } )
        .catch( error => {
            res.status( 500 ).json( {
                error: 'Error saving new account.'
            } );
        } );
} );

server.put( '/:id', ( req, res ) => {
    const { id } = req.params;
    const changes = req.body;
    db( 'accounts' )
        .where( { id } )
        .update( changes )
        .then( count => {
            res.status( 200 ).json( {
                message: `${ count } record(s) updated.`
            } )
        } )
        .catch( error => {
            console.log( error );
            res.status( 500 ).json( {
                error: 'Error updating account.'
            } );
        } );
} );

server.delete( '/:id', ( req, res ) => {
    const { id } = req.params;
    db( 'accounts' )
        .where( { id } )
        .del()
        .then( count => {
            res.status( 200 ).json( {
                message: `${ count } records deleted.`
            } );
        } )
        .catch( error => {
            console.log( error );
            res.status( 500 ).json( {
                error: 'Error deleting the account.'
            } );
        } );
} );

module.exports = server;

module.exports = server;