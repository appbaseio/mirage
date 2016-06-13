import { describe, it, beforeEach, expect } from '@angular/core/testing';

import { TermQuery } from './term.query';

describe('Term query format', () => {

  // Set initial things
  // set expected query format
  var query: TermQuery;
  var expectedFormat = {
    'term': {
      'foo': 'bar'
    }
  };

  // instantiate query component and set the input fields 
  beforeEach(function() {
    query = new TermQuery();
    query.queryName = 'term';
    query.fieldName = 'foo';
    query.inputs = {
      input: {
        value: 'bar'
      }
    };
  });

  function isValidJson(str: string) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }

  // Test to check if queryformat is valid json
  it('is valid json', () => {
    var format = query.setFormat();
    var validJson = isValidJson(JSON.stringify(format));
    expect(validJson).toEqual(true);
  });

  // Test to check if result of setformat is equal to expected query format.
  it('Is setformat matches with expected query format', () => {
    var format = query.setFormat();
    expect(format).toEqual(expectedFormat);
  });

})
