var express = require('express');
var router = express.Router();
var methods = require('../methods');
var models = require('../models/index');

// Show All Post
router.get('/', methods.verifyToken, async function(req, res, next) {
    try {
       const posts = await models.posts.findAll({});

       if(posts.length !== 0){
           res.json({
               'status': 'OK',
               'messages': '',
               'data': posts
           });
       } else {
           res.json({
               'status': 'EMPTY',
               'messages': 'Data is empty!',
               'data': {}
           });
       }
    } catch (error) {
        res.status(500).json({
            'status': 'ERROR',
            'messages': 'Internal Server Error!'
        });
    }
});

// Show All User's Post
router.get('/users/:id', methods.verifyToken, async function(req, res, next) {
    try {
        const posts = await models.posts.findAll({
            where: {
                user_id: req.params.id
            }
        })

        if(posts.length !== 0){
            res.json({
                'status': 'OK',
                'messages': '',
                'data': posts
            });
        } else {
            res.json({
                'status': 'EMPTY',
                'messages': 'Data is empty!',
                'data': null
            });
        }
    } catch (error) {
        res.status(500).json({
            'status': 'ERROR',
            'messages': 'Internal Server Error!'
        })
    }
});

// Show Specific Post By Id
router.get('/:id', methods.verifyToken, async function(req, res, next) {
    try {
        const post = await models.posts.findByPk(req.params.id);

        if(post){
            res.json({
                'status': 'OK',
                'messages': '',
                'data': post
            });
        } else {
            res.status(404).json({
                'status': 'NOT_FOUND',
                'messages': 'Post not found!',
                'data': null
            });
        }
    } catch (error) {
        res.status(500).json({
            'status': 'ERROR',
            'messages': 'Internal Server Error!'
        })
    }
});

// Create Post
router.post('/', methods.verifyToken, async function(req, res, next) {
    try {
        const {content,user_id} = req.body;
        
        const post = await models.posts.create({
            content,
            user_id
        });
        
        if(post){
            res.status(201).json({
                'status': 'OK',
                'messages': 'Post has been created successfully',
                'data': post
            })
        }
    } catch (error) {
        res.status(400).json({
            'status': 'ERROR',
            'messages': error.message
        })
    }
});

// Update Post
router.patch('/:id', methods.verifyToken, async function(req, res, next) {
    try {
        const {content,user_id} = req.body;

        const post = await models.posts.findByPk(req.params.id);
        if(!post){
            res.status(404).json({
                'status': 'NOT_FOUND',
                'messages': 'Post not found!'
            })
        } else {
            if(post.user_id != user_id){
                res.status(403).json({
                    'status': 'FORBIDDEN',
                    'messages': 'Different User ID'
                })
            }
            post.update({
                content: content || post.content
            })
            res.status(200).json({
                'status': 'OK',
                'messages': 'Post has been updated successfully',
                'data': post
            })
        }
    } catch (error) {
        res.status(400).json({
            'status': 'ERROR',
            'messages': error.message
        })
    }
})

// Delete Post
router.delete('/:id', methods.verifyToken, async function(req, res, next) {
    try {
        const {user_id} = req.body;
        const post = await models.posts.findByPk(req.params.id);
        
        if(!post){
            res.status(404).json({
                'status': 'NOT_FOUND',
                'messages': 'Post not found!'
            })
        } else {
            if(post.user_id != user_id){
                res.status(403).json({
                    'status': 'FORBIDDEN',
                    'messages': 'Different User ID'
                })
            }
            post.destroy()
            res.json({
                'status': 'NO_CONTENT',
                'messages': 'Post has been deleted!'
            })
        }
    } catch (error) {
        res.status(400).json({
            'status': 'ERROR',
            'messages': error.message
        })
    }
})

module.exports = router;