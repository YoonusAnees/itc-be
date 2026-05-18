import Quote from "../models/quote.model.js";

export const createQuoteService = async (body) => {
  const { customerName, phone } = body;

  if (!customerName || !phone) {
    throw new Error("Customer name and phone number are required");
  }

  const quote = await Quote.create(body);

  return quote;
};

export const getQuotesService = async (query) => {
  const { status, requestType } = query;

  const filter = {};

  if (status) {
    filter.status = status;
  }

  if (requestType) {
    filter.requestType = requestType;
  }

  return await Quote.find(filter)
    .populate("items.productId")
    .sort({ createdAt: -1 });
};

export const getSingleQuoteService = async (id) => {
  const quote = await Quote.findById(id).populate("items.productId");

  if (!quote) {
    throw new Error("Request not found");
  }

  return quote;
};

export const updateQuoteStatusService = async (id, body) => {
  const quote = await Quote.findByIdAndUpdate(
    id,
    {
      status: body.status,
      adminNote: body.adminNote,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!quote) {
    throw new Error("Request not found");
  }

  return quote;
};

export const deleteQuoteService = async (id) => {
  const quote = await Quote.findByIdAndDelete(id);

  if (!quote) {
    throw new Error("Request not found");
  }

  return quote;
};