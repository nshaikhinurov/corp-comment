import { create } from "zustand";
import { Feedback } from "../lib/types";

type Store = {
  feedbackItems: Feedback[];
  isLoading: boolean;
  errorMessage: string;
  selectedCompany: string;
  addItemToList: (text: string) => Promise<void>;
  selectCompany: (company: string) => void;
  fetchFeedbackItems: () => Promise<void>;
  getCompanyList: () => string[];
  getFilteredFeedbackItems: () => Feedback[];
};

export const useFeedbackItemsStore = create<Store>((set, get) => ({
  feedbackItems: [],
  isLoading: false,
  errorMessage: "",
  selectedCompany: "",
  addItemToList: async (text: string) => {
    // regex pattern with a positive lookbehind for '#' and capturing the word following it
    const regex = /(?<=#)\w+/g;
    const companyName = text.match(regex)?.[0] || "";
    const newItem: Feedback = {
      id: Date.now().toString(),
      upvoteCount: 0,
      badgeLetter: companyName[0].toUpperCase(),
      company: companyName || "New Company",
      text,
      daysAgo: 0,
    };

    set(({ feedbackItems }) => ({
      feedbackItems: [newItem, ...feedbackItems],
    }));

    await fetch(
      "https://bytegrad.com/course-assets/projects/corpcomment/api/feedbacks",
      {
        method: "POST",
        body: JSON.stringify(newItem),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
  },
  selectCompany: (company: string) => {
    set({ selectedCompany: company });
  },
  fetchFeedbackItems: async () => {
    try {
      set({ isLoading: true });

      const response = await fetch(
        "https://bytegrad.com/course-assets/projects/corpcomment/api/feedbacks"
      );

      if (!response.ok) {
        throw new Error();
      }

      const feedbacks = await response.json();
      set({ feedbackItems: feedbacks.feedbacks });
    } catch (error) {
      set({ errorMessage: "Failed to load feedbacks" });
    } finally {
      set({ isLoading: false });
    }
  },
  getCompanyList: () =>
    Array.from(new Set(get().feedbackItems.map((item) => item.company))),
  getFilteredFeedbackItems: () =>
    get().selectedCompany
      ? get().feedbackItems.filter(
          (item) => item.company === get().selectedCompany
        )
      : get().feedbackItems,
}));
