
mongoose
  .connect(process.env.MONGOURL)
  .then(async () => {
    console.log("Connected to the database successfully!");

    try {
      const products = await Product.find({}).lean(); // raw JS objects, no casting

      for (const product of products) {
        let updateNeeded = false;

        const cleanedRatingData = product.ratingData.map((review) => {
          // Clone review object to avoid mutation issues
          const newReview = { ...review };

          // Sanitize likes
          if (!Array.isArray(newReview.likes)) {
            try {
              newReview.likes = JSON.parse(newReview.likes);
            } catch {
              newReview.likes = [];
            }
          }

          newReview.likes = (newReview.likes || []).filter((id) =>
            Types.ObjectId.isValid(id)
          );

          // Sanitize dislikes
          if (!Array.isArray(newReview.dislikes)) {
            try {
              newReview.dislikes = JSON.parse(newReview.dislikes);
            } catch {
              newReview.dislikes = [];
            }
          }

          newReview.dislikes = (newReview.dislikes || []).filter((id) =>
            Types.ObjectId.isValid(id)
          );

          return newReview;
        });

        await Product.updateOne(
          { _id: product._id },
          { $set: { ratingData: cleanedRatingData } }
        );

        console.log(`✅ Cleaned product: ${product._id}`);
      }

      console.log("✅ Migration complete without validation errors.");
    } catch (err) {
      console.error("❌ Migration error:", err);
    }

    server.listen(process.env.PORT, () => {
      console.log(`Server is running at PORT: ${process.env.PORT}`);
    });

    app.get("/", (req, res) => {
      res.send("Hello world!");
    });
  })
  .catch((err) => {
    console.error(`❌ Error connecting to MongoDB: ${err}`);
  });

