import React, { useContext, useEffect, useState } from "react";
import ReactStars from "react-rating-stars-component";
import {
  addDoc,
  doc,
  getDocs,
  updateDoc,
  query,
  where,
} from "firebase/firestore";
import { reviewCollection, db } from "../../firebase/firebase";
import { TailSpin, ThreeDots } from "react-loader-spinner";
import swal from "sweetalert";
import { AppState } from "../../App";
import { useNavigate } from "react-router-dom";

const Reviews = ({ id, prevRating, userRated }) => {
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState("");
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [data, setData] = useState([]);
  const useAppState = useContext(AppState);
  const navigate = useNavigate();
  const [newAdded, setNewAdded] = useState(0);

  const sendReview = async () => {
    setLoading(true);
    try {
      if (useAppState.login) {
        await addDoc(reviewCollection, {
          movieid: id,
          name: useAppState.userName,
          rating: rating,
          thought: form,
          timestamp: new Date().getTime(),
        });

        const _doc = doc(db, "movies", id);
        await updateDoc(_doc, {
          rating: prevRating + rating,
          rated: userRated + 1,
        });

        setRating(0);
        setForm("");
        setNewAdded(newAdded + 1);
        swal({
          title: "Review Sent..",
          icon: "success",
          buttons: false,
          timer: 3000,
        });
      } else {
        navigate("/login");
      }
    } catch (error) {
      swal({
        title: error.message,
        icon: "error",
        buttons: false,
        timer: 3000,
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    async function getData() {
      setReviewsLoading(true);
      setData([]);
      const que = query(reviewCollection, where("movieid", "==", id));

      const queryShot = await getDocs(que);

      queryShot.forEach((doc) => {
        setData((prev) => [...prev, doc.data()]);
      });

      setReviewsLoading(false);
    }
    getData();
  }, [newAdded]);
  return (
    <>
      <div className="mt-4 border-t-2 border-gray-700 w-full">
        <ReactStars
          size={30}
          half={true}
          value={rating}
          onChange={(rate) => setRating(rate)}
        />
        <input
          value={form}
          onChange={(e) => setForm(e.target.value)}
          className="w-full p-2 outline-none header"
          placeholder="Share your Thoughts..."
        />

        <button
          onClick={sendReview}
          className="bg-green-600 hover:bg-green-700 w-full p-2 flex justify-center transition-all duration-500 cursor-pointer"
        >
          {loading ? <TailSpin height={25} color="white" /> : "Share"}
        </button>
        {reviewsLoading ? (
          <div className="flex justify-center mt-6">
            <ThreeDots height={10} color="white" />
          </div>
        ) : (
          <div className="mt-4">
            {data.map((e, i) => {
              return (
                <>
                  <div
                    key={i}
                    className="w-full p-2 mt-2 border-b header border-gray-500"
                  >
                    <div className="flex items-center">
                      <p className="text-blue-500">{e.name}</p>
                      <p className="ml-3">
                        ({new Date(e.timestamp).toLocaleString()})
                      </p>
                    </div>
                    <ReactStars
                      size={15}
                      half={true}
                      value={e.rating}
                      edit={false}
                    />
                    <p>{e.thought}</p>
                  </div>
                </>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default Reviews;
