import {
  createQuoteService,
  getQuotesService,
  getSingleQuoteService,
  updateQuoteStatusService,
  deleteQuoteService,
} from "../services/quote.service.js";

export const createQuote = async (req, res) => {
  try {
    const quote = await createQuoteService(req.body);

    res.status(201).json({
      success: true,
      message: "Request submitted successfully",
      data: quote,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getQuotes = async (req, res) => {
  try {
    const quotes = await getQuotesService(req.query);

    res.json({
      success: true,
      count: quotes.length,
      data: quotes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getSingleQuote = async (req, res) => {
  try {
    const quote = await getSingleQuoteService(req.params.id);

    res.json({
      success: true,
      data: quote,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateQuoteStatus = async (req, res) => {
  try {
    const quote = await updateQuoteStatusService(req.params.id, req.body);

    res.json({
      success: true,
      message: "Request updated successfully",
      data: quote,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteQuote = async (req, res) => {
  try {
    await deleteQuoteService(req.params.id);

    res.json({
      success: true,
      message: "Request deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};