import { useQuery, gql } from "@apollo/client";
import CityList from "./CityList";

/**
 * In query declaration you need to pass fragment reference in gql literals.
 * After that Actual fragment name need to be spreadd at appropriate place.
 *
 * I've followed below link to create this structure:-
 *
 * @link https://www.apollographql.com/docs/react/data/fragments
 *
 * There is also webpack support to add fragment imports:-
 *
 * @link https://www.apollographql.com/docs/react/integrations/webpack/#fragments
 */

const GET_LOCATIONS = gql`
  query GetCityList($search: String!, $first: Int!) {
    cities(search: $search, first: $first) {
      total
      pageInfo {
        endCursor
        hasNextPage
      }
      edges {
        cursor
        node {
          id
          ...CityListFragment
        }
      }
    }
  }
  ${CityList.fragments.city}
`;

const DisplayLocations = () => {
  const { loading, error, data } = useQuery(GET_LOCATIONS, {
    variables: { search: "vad", first: 5 }, // Used absolute values for demo purpose
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return data.cities.edges.map(({ cursor, node }) => (
    <CityList key={cursor} {...node} />
  ));
};

export default DisplayLocations;
