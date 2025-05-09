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
        const date = req.params.date;
        const ext = path.extname(file.originalname);
        cb(null, `${date}${ext}`);
    }
});

const upload = multer({ storage });

app.get('/', (req, res) => {
    res.send('CalGal backend running!');
  });  

app.post('/upload/:date', upload.single('image'), (req, res) => {
    const { date } = req.params;
    res.json({ message : 'upload successfule', date });
});

// 날짜 기반 이미지 반환
app.get('/image/:date', (req, res) => {
    const date = req.params.date;
    const extensions = ['.png', '.jpg', '.jpeg'];

    for (const ext of extensions) {
        const fullPath = path.join(uploadDir, `${date}${ext}`);
        if (fs.existsSync(fullPath)) {
        return res.sendFile(fullPath);
        }
    }

    res.status(404).send('Image not found');
});

app.delete('/delete/:date', (req, res) => {
    const { date } = req.params;
    const extensions = ['.png', '.jpg', '.jpeg'];

    let deleted = false;

    for (const ext of extensions) {
        const filePath = path.join(__dirname, 'uploads', `${date}${ext}`);
        if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        deleted = true;
        break;
        }
    }

    if (deleted) {
        res.json({ message: 'Deleting file complete', date });
    } else {
        res.status(404).json({ message: 'File not found for given date' });
    }
});
  

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});