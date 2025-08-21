import { createSearchParamsCache, parseAsStringEnum } from "nuqs/server";
export enum Filter {
  all = "all",
  complete = "complete",
  inComplete = "inComplete",
}
export const searchParamsParser = {
  filter: parseAsStringEnum<Filter>(Object.values(Filter))
    .withDefault(Filter["all"])
    .withOptions({ shallow: true }),
};

export const searchParamsCache = createSearchParamsCache(searchParamsParser);
