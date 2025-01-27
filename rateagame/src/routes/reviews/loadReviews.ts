import { Context } from "hono";

export const loadReviews = async (c: Context) => {
  const requestData = await c.req.json().catch(() => null); // catch in case no JSON is sent
  c.json({
    message: "Review created successfully!",
    data: requestData,
  });
  console.log(requestData);
};
