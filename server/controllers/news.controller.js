import NewsModel from "../models/news.model.js";

export const createNewsController = async (request, response) => {
  try {
    const { title, image, category, content, author, tags } = request.body;

    if (!title || !image || !content) {
      return response.status(400).json({
        message: "Enter required fields",
        error: true,
        success: false,
      });
    }

    const news = new NewsModel({
      title,
      image,
      category,
      content,
      author,
      tags,
    });

    const saveNews = await news.save();

    return response.json({
      message: "News Created Successfully",
      data: saveNews,
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export const getNewsController = async (request, response) => {
  try {
    let { page, limit, search } = request.body;
    page = page || 1;
    limit = limit || 10;

    const query = search ? { $text: { $search: search } } : {};
    const skip = (page - 1) * limit;

    const [data, totalCount] = await Promise.all([
      NewsModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      NewsModel.countDocuments(query),
    ]);

    return response.json({
      message: "News data",
      error: false,
      success: true,
      totalCount,
      totalNoPage: Math.ceil(totalCount / limit),
      data,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export const getNewsByCategory = async (request, response) => {
  try {
    const { id } = request.body;

    if (!id) {
      return response.status(400).json({
        message: "Provide category id",
        error: true,
        success: false,
      });
    }

    const news = await NewsModel.find({ category: { $in: id } }).limit(15);

    return response.json({
      message: "Category news list",
      data: news,
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export const getNewsDetails = async (request, response) => {
  try {
    const { newsId } = request.body;

    const news = await NewsModel.findOne({ _id: newsId });

    return response.json({
      message: "News details",
      data: news,
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export const updateNewsDetails = async (request, response) => {
  try {
    const { _id } = request.body;

    if (!_id) {
      return response.status(400).json({
        message: "Provide news _id",
        error: true,
        success: false,
      });
    }

    const updateNews = await NewsModel.updateOne({ _id }, request.body);

    return response.json({
      message: "Updated successfully",
      data: updateNews,
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export const deleteNewsDetails = async (request, response) => {
  try {
    const { _id } = request.body;

    if (!_id) {
      return response.status(400).json({
        message: "Provide _id",
        error: true,
        success: false,
      });
    }

    const deleteNews = await NewsModel.deleteOne({ _id });

    return response.json({
      message: "Deleted successfully",
      error: false,
      success: true,
      data: deleteNews,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};
