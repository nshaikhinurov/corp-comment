import { useFeedbackItemsStore } from "../../stores/feedbackItemsStore";
import { ErrorMessage } from "../ErrorMessage";
import { Spinner } from "../Spinner";
import { FeedbackItem } from "./FeedbackItem";

export const FeedbackList = () => {
  const isLoading = useFeedbackItemsStore((state) => state.isLoading);
  const errorMessage = useFeedbackItemsStore((state) => state.errorMessage);
  const filteredFeedbackItems = useFeedbackItemsStore((state) =>
    state.getFilteredFeedbackItems()
  );

  return (
    <ol className="feedback-list">
      {isLoading && <Spinner />}
      {errorMessage && <ErrorMessage message={errorMessage} />}
      {filteredFeedbackItems.map((feedback) => (
        <FeedbackItem key={feedback.id} feedback={feedback} />
      ))}
    </ol>
  );
};
