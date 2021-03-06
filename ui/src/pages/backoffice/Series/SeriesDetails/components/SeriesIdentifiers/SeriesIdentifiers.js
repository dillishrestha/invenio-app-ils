import { InfoMessage, MetadataTable } from '@pages/backoffice';
import { groupedSchemeValueList } from '@pages/backoffice/utils';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

export class SeriesIdentifiers extends Component {
  render() {
    const { series } = this.props;
    return series.metadata.identifiers ? (
      <MetadataTable
        rows={groupedSchemeValueList(series.metadata.identifiers)}
      />
    ) : (
      <InfoMessage
        header={'No stored identifiers.'}
        content={'Edit series to add identifiers'}
      />
    );
  }
}

SeriesIdentifiers.propTypes = {
  series: PropTypes.object.isRequired,
};
