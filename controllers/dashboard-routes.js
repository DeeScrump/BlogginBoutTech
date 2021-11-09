const router = require('express').Router();
const { Post } = require('../models/');
const withAuth = require('../utils/auth');

// Get all posts for the admin or current logged in user to their dashboard page
router.get('/', withAuth, async (req, res) => {
  try {
    const postData = await Post.findAll({
      where: {
        userId: req.session.userId,
      },
    });

    const posts = postData.map((post) => post.get({ plain: true }));

    res.render('all-posts-admin', {
      layout: 'dashboard',
      posts,
    });
  } catch (err) {
    res.redirect('login');
  }
});

// Link allowing user to post a new post to their dashboard
router.get('/new', withAuth, (req, res) => {
  res.render('new-post', {
    layout: 'dashboard',
  });
});

// Edit specific post from user dashboard (update or delete options)
router.get('/edit/:id', withAuth, async (req, res) => {
  try {
    const postData = await Post.findByPk(req.params.id);

    if (postData) {
      const post = postData.get({ plain: true });

      res.render('edit-post', {
        layout: 'dashboard',
        post,
      });
    } else {
      res.status(404).end();
    }
  } catch (err) {
    res.redirect('login');
  }
});

module.exports = router;
