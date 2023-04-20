import { useReducer } from "react";

export enum PageActionTypes {
  NextPage,
  PreviousPage,
  GoToPage,
}

type PageAction = {
  type: PageActionTypes;
  payload?: {
    newPage: number;
  };
};

export function paginationReducer(page: number, action: PageAction) {
  switch (action.type) {
    case PageActionTypes.NextPage:
      return page + 1;
    case PageActionTypes.PreviousPage:
      return page - 1;
    case PageActionTypes.GoToPage:
      return action.payload?.newPage || page;
    default:
      return page;
  }
}

export default function usePagination(initialPage: number) {
  const [page, dispatch] = useReducer(paginationReducer, initialPage);
  const limit = 10;

  function previousPage() {
    dispatch({ type: PageActionTypes.PreviousPage });
  }

  function nextPage() {
    dispatch({ type: PageActionTypes.NextPage });
  }

  function goToPage(pageNum: number) {
    dispatch({
      type: PageActionTypes.GoToPage,
      payload: {
        newPage: pageNum,
      },
    });
  }

  return {
    page,
    limit,
    previousPage,
    nextPage,
    goToPage,
  };
}
