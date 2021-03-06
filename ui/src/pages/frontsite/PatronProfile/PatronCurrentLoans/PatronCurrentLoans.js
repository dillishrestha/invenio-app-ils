import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Loader, Error, Pagination } from '@components';
import { Container, Header, Item } from 'semantic-ui-react';
import _isEmpty from 'lodash/isEmpty';
import { ILSItemPlaceholder } from '@components/ILSPlaceholder/ILSPlaceholder';
import { NoResultsMessage } from '../../components/NoResultsMessage';
import { LoanListEntry } from './components/LoanListEntry';

const PAGE_SIZE = 5;

export default class PatronCurrentLoans extends Component {
  constructor(props) {
    super(props);
    this.fetchPatronCurrentLoans = this.props.fetchPatronCurrentLoans;
    this.patronPid = this.props.patronPid;
    this.state = { activePage: 1 };
  }

  componentDidMount() {
    this.fetchPatronCurrentLoans(
      this.patronPid,
      this.state.activePage,
      PAGE_SIZE
    );
  }

  onPageChange = activePage => {
    this.fetchPatronCurrentLoans(this.patronPid, activePage, PAGE_SIZE);
    this.setState({ activePage: activePage });
  };

  paginationComponent = () => {
    return (
      <Pagination
        currentPage={this.state.activePage}
        currentSize={PAGE_SIZE}
        loading={this.props.isLoading}
        onPageChange={this.onPageChange}
        totalResults={this.props.data.total}
      />
    );
  };

  renderList(data) {
    if (!_isEmpty(data.hits)) {
      return (
        <>
          <Item.Group divided>
            {data.hits.map(entry => (
              <LoanListEntry key={entry.metadata.pid} loan={entry} />
            ))}
          </Item.Group>
          <Container textAlign={'center'}>
            {this.paginationComponent()}
          </Container>
        </>
      );
    }
    return (
      <NoResultsMessage
        messageHeader={'No loans'}
        messageContent={'Currently you do not have any literature on loan'}
      />
    );
  }

  renderLoader = props => {
    return (
      <>
        <Item.Group>
          <ILSItemPlaceholder fluid {...props} />
          <ILSItemPlaceholder fluid {...props} />
        </Item.Group>
      </>
    );
  };

  render() {
    const { data, isLoading, error } = this.props;
    return (
      <Container className={'spaced'}>
        <Header
          as={'h2'}
          content={'Your current loans'}
          className={'highlight'}
          textAlign={'center'}
        />
        <Loader isLoading={isLoading} renderElement={this.renderLoader}>
          <Error error={error}>{this.renderList(data)}</Error>
        </Loader>
      </Container>
    );
  }
}

PatronCurrentLoans.propTypes = {
  patronPid: PropTypes.string.isRequired,
  fetchPatronCurrentLoans: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  showMaxRows: PropTypes.number,
};
