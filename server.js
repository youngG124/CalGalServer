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
    destination: function (req, file, cb) {
        cb(null, 'uploads');
    },
    filename : function (req, file, cb) {
        const { date } = req.body;
        const ext = path.extname(file.originalname);
        cb(null, `${date}${ext}`);
    }
});

const upload = multer({ storage });

app.post('/upload', upload.single('image'), (req, res) => {
    const { date } = req.body;
    const fileUrl = `http://localhost:${PORT}/uploads/${req.file.filenmame}`;
    res.json({ message : 'upload successfule', fileUrl, date });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});