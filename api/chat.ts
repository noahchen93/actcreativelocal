export default {
  fetch() {
    return Response.json(
      {
        error: "The ACT Creative AI assistant has been retired.",
        status: "retired",
      },
      {
        status: 410,
        headers: {
          "Cache-Control": "no-store",
          "X-Content-Type-Options": "nosniff",
        },
      },
    );
  },
};
