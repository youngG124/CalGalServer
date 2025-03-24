const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: function (cb) {
        cb(null, 'uploads');
    },
    filename : function (req, file, cb) {
        const date = req.params.date;
        const ext = path.extname(file.originalname);
        cb(null, `${date}${ext}`);
    }
});

const upload = multer({ storage });

app.post('/upload/:date', upload.single('image'), (req, res) => {
    const { date } = req.params;
    res.json({ message : 'upload successfule', date });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});