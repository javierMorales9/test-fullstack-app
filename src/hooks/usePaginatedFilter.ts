import { useReducer } from "react";
import { PageActionTypes, paginationReducer } from "./usePagination";
import { useUpdateEffect } from "usehooks-ts";

enum ActionTypes {
  ModifyFilter,
  ModifyPage,
}

type State = {
  filters: Array<any>;
  page: number;
  limit: number;
};

type Action = {
  type: ActionTypes;
  payload?: {
    pageActionType?: PageActionTypes;
    newPage?: number;
    filterValues?: Array<any>;
  };
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case ActionTypes.ModifyFilter:
      return {
        ...state,
        filters: action.payload?.filterValues || [],
        page: paginationReducer(state.page, {
          type: PageActionTypes.GoToPage,
          payload: { newPage: 1 },
        }),
      };
    case ActionTypes.ModifyPage:
      return {
        ...state,
        page: paginationReducer(state.page, {
          type: action.payload?.pageActionType || PageActionTypes.GoToPage,
          payload: { newPage: action.payload?.newPage || 1 },
        }),
      };
    default:
      return state;
  }
}

export default function usePaginatedFilter(filters: Array<any>) {
  const [filterObject, dispatch] = useReducer(
    reducer,
    {
      filters,
      page: 1,
      limit: 10,
    },
    (initialState) => initialState,
  );

  useUpdateEffect(() => {
    dispatch({
      type: ActionTypes.ModifyFilter,
      payload: {
        filterValues: [...filters],
      },
    });
  }, [...filters]);

  function previousPage() {
    dispatch({
      type: ActionTypes.ModifyPage,
      payload: { pageActionType: PageActionTypes.PreviousPage },
    });
  }

  function nextPage() {
    dispatch({
      type: ActionTypes.ModifyPage,
      payload: { pageActionType: PageActionTypes.NextPage },
    });
  }

  function goToPage(newPage: number) {
    dispatch({
      type: ActionTypes.ModifyPage,
      payload: {
        pageActionType: PageActionTypes.GoToPage,
        newPage: newPage,
      },
    });
  }

  return {
    filters: filterObject.filters,
    pagination: {
      page: filterObject.page,
      limit: filterObject.limit,
      previousPage,
      nextPage,
      goToPage,
    },
  };
}
