import { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import api from "../../lib/api";

const ReviewPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await api.get("/admin/reviews");
        const data = res.data;

        setReviews(Array.isArray(data) ? data : []);
      } catch (error) {
        console.log(
          "Gagal ambil reviews",
          error.response?.data || error.message
        );
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-6">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-semibold text-gray-800">
              Manajemen Review
            </h1>
            <p className="text-sm text-gray-500">
              {reviews.length} total review
            </p>
          </div>
        </div>

        {/* CONTENT */}
        {loading ? (
          <div className="bg-white p-6 rounded-xl shadow-sm text-center text-gray-500">
            Loading review...
          </div>
        ) : reviews.length === 0 ? (
          <div className="bg-white p-6 rounded-xl shadow-sm text-center text-gray-400">
            Belum ada review
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div
                key={review._id}
                className="bg-white p-5 rounded-xl shadow-sm border hover:shadow-md transition"
              >

                {/* TOP */}
                <div className="flex justify-between items-start">

                  {/* USER */}
                  <div className="flex gap-3">

                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                      {review?.user_id?.name?.charAt(0) || "U"}
                    </div>

                    <div>
                      <p className="font-semibold text-gray-800">
                        {review?.user_id?.name || "Unknown"}
                      </p>

                      <p className="text-sm text-yellow-500">
                        {"★".repeat(review.rating || 0)}
                        <span className="text-gray-400 ml-2">
                          untuk {review?.product_id?.name || "-"}
                        </span>
                      </p>
                    </div>

                  </div>

                  {/* DATE */}
                  <p className="text-xs text-gray-400">
                    {review.createdAt
                      ? new Date(review.createdAt).toLocaleDateString("id-ID")
                      : "-"}
                  </p>

                </div>

                {/* COMMENT */}
                <p className="text-sm text-gray-600 mt-3 leading-relaxed">
                  {review.comment || "-"}
                </p>

              </div>
            ))}
          </div>
        )}

      </div>
    </AdminLayout>
  );
};

export default ReviewPage;