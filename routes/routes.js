const router = require('express').Router();


router.get('/', (req, res) => {
    if (req.user) {
        // console.log(req.user)
        res.render('index', { username: req.user.displayName, mail: req.user.email });
    } else {
        res.render('index', { username: null });
    }
});

router.get('/claims', (req, res) => {
    if (req.user) {
        const dataArr = Object.entries(req.user.userProfile.attributes);
        // console.log(dataArr)
        // console.log(dataArr[0][0])
        const claimNames = dataArr.map(name => name[0].split('/').pop());

        console.log(claimNames)
        res.render('claims', { attributes: dataArr, claimNames: claimNames });
    } else {
        res.render('claims', { attributes: null, claimNames: null });
    }
});


module.exports = router;