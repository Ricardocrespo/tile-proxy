Feature: Tile Proxy Routing

  Background:
    Given a running tile proxy server

  @happy
  Scenario: Fetch valid tile
    When I request tile "/tiles/16/13388/26665"
    Then I receive a 200 status code

  @cache
  Scenario: Serve tile from cache
    Given a running tile proxy server
    And a cached tile exists for "/tiles/16/13388/26665"
    When I request tile "/tiles/16/13388/26665"
    Then I receive a 200 status code
    And the response should be a PNG image
    And the response body should be a Buffer
    And no external request should be made

  @invalidCoords
  Scenario: Request with non-numeric tile coordinates
    When I request tile "/tiles/foo/bar/baz"
    Then I receive a 422 status code

  @outOfBounds
  Scenario: Request tile far from any port of entry
    When I request tile "/tiles/16/1/1"
    Then I receive a 403 status code

  @unsupportedZoom
  Scenario: Request with unsupported zoom level
    When I request tile "/tiles/99/14059/26303"
    Then I receive a 422 status code
