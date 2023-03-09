import { gql, useLazyQuery } from "@apollo/client";
import { useEffect } from "react";
import CityList from "./CityList";
import Button  from 'storybook-demo-stories';

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

const FRAGMENT = gql`
  fragment ScorecardFragment on ScoreCard {
    teamId
    tournamentId
    matchId
    inning
  }
`;

const GET_FULL_SCORECARD_DATA = gql`
  query fullScorecard($fullScoreCardInputType: FullScoreCardInputType) {
    fullScorecard(fullScoreCardInputType: $fullScoreCardInputType) {
      ...ScorecardFragment
    }
  }
  ${FRAGMENT}
`;

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
  const [fetchLocation, { loading, error, data }] = useLazyQuery(
    GET_LOCATIONS,
    {
      variables: { search: "vad", first: 5 }, // Used absolute values for demo purpose
    }
  );

  const [fetchScores, { data: scoreCardData }] = useLazyQuery(
    GET_FULL_SCORECARD_DATA,
    {
      variables: {
        fullScoreCardInputType: {
          matchId: "54bfd4f0-5eab-11ed-9bc8-093868461d21",
          teamId: "8841a1c0-5ea9-11ed-9bc8-093868461d21",
          tournamentId: "7cc124b0-5ea9-11ed-9bc8-093868461d21",
          inning: 1,
        },
      }, // Used absolute values for demo purpose
    }
  );

  useEffect(() => {
    fetchScores();
  }, [fetchScores]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <>
      <div>
        <Button size="large" label="Get Locations" primary type="button" onClick={fetchLocation}/>
      </div>
      {data?.cities?.edges.map(({ cursor, node }) => (
        <CityList key={cursor} {...node} />
      ))}
      <div>{JSON.stringify(scoreCardData, null, 2)}</div>
    </>
  );
};

export default DisplayLocations;
