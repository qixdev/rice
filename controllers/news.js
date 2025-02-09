const News = require("../models/News");
const axios = require("axios");

async function createNews(req, res) {
    try {
        const {name_en, name_ru, desc_en, desc_ru} = req.body;
        if (!name_en || !name_ru || !desc_en || !desc_ru) {
            return res.status(400).json({error: "Both names and descriptions are required"});
        }

        if (!req.files || req.files.length !== 3) {
            return res.status(400).json({error: "Exactly 3 images are required"});
        }

        const images = req.files.map(file => `/uploads/${file.filename}`);

        const news = new News({
            name_en,
            name_ru,
            desc_en,
            desc_ru,
            images,
            createdBy: req.user._id,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        await news.save();
        res.status(201).json(news);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Failed to create news article"});
    }
}


async function isTextInLanguage(text, language) {
    try {
        const response = await axios.post(
            "https://ws.detectlanguage.com/0.2/detect",
            new URLSearchParams({q: text}),
            {
                headers: {
                    "Authorization": "Bearer e157103a9cf7efad4dd3a806fb125a08",
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            }
        );
        const detections = response.data?.data?.detections || [];

        const reliableLanguage = detections.find(det => det.isReliable === true);

        if (reliableLanguage) {
            return reliableLanguage.language === language;
        }
        return false;
    } catch (error) {
        console.error("Error detecting language:", error.response?.data || error.message);
        return false;
    }
}


async function fetchCryptoNews(locale, page = 1) {
    try {
        const response = await axios.get(`https://api.coingecko.com/api/v3/news`, {
            params: {page, locale}
        });

        const newsData = response.data?.data || [];
        const news = newsData.map(article => ({
            id: article.id,
            title: article.title,
            description: article.description || "No description available",
            author: article.author?.split("(")[0].trim() || "Unknown",
            url: article.url,
            newsSite: article.news_site,
            thumbnail: article.thumb_2x || null,
            publishedAt: new Date(article.created_at * 1000).toISOString(),
            updatedAt: new Date(article.updated_at * 1000).toISOString()
        }));
        const filteredNews = await Promise.all(
            news.map(async (article) => ({
                ...article,
                isMatching: await isTextInLanguage(article.description, locale)
            }))
        );
        return filteredNews.filter(article => article.isMatching);
    } catch (error) {
        console.error("Error fetching news:", error.response?.data || error.message);
        return [];
    }
}

async function getNews(req, res) {
    try {
        const locale = req.query.locale || "en";

        const allowedLocales = ["en", "ru"];
        if (!allowedLocales.includes(locale)) {
            return res.status(404).json({error: "no such locale"});
        }
        const websiteNews = await News.find();

        const formattedWebsiteNews = websiteNews.map(news => ({
            id: news._id,
            title: news[`name_${locale}`],
            description: news[`desc_${locale}`],
            images: news.images,
            createdAt: news.createdAt,
            updatedAt: news.updatedAt
        }));

        const globalNews = await fetchCryptoNews(locale, 1);

        res.status(200).json({
            websiteNews: formattedWebsiteNews,
            globalNews: globalNews
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Failed to fetch news"});
    }
}

async function getSingleNews(req, res) {
    try {
        const news = await News.findById(req.params.id);
        if (!news) return res.status(404).json({error: "News not found"});
        res.status(200).json(news);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Error fetching news"});
    }
}

async function updateNews(req, res) {
    try {
        const {name_en, name_ru, desc_en, desc_ru} = req.body;

        const updateData = {name_en, name_ru, desc_en, desc_ru, updatedAt: new Date()};
        if (!req.files || req.files.length !== 3) {
            return res.status(400).json({error: "Exactly 3 images are required"});
        }

        updateData.images = req.files.map(file => `/uploads/${file.filename}`);

        const updatedNews = await News.findByIdAndUpdate(req.params.id, updateData, {new: true});
        if (!updatedNews) return res.status(404).json({error: "News not found"});

        res.status(200).json(updatedNews);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Failed to update news"});
    }
}

async function deleteNews(req, res) {
    try {
        const news = await News.findByIdAndDelete(req.params.id);
        if (!news) return res.status(404).json({error: "News not found"});

        res.status(200).json({message: "News deleted successfully"});
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Failed to delete news"});
    }
}

module.exports = {
    createNews,
    getNews,
    getSingleNews,
    updateNews,
    deleteNews
};
