# -*- coding: utf-8 -*-
#
# Copyright (C) 2018 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Helpers for tests."""

from __future__ import absolute_import, print_function

import json

from invenio_accounts.models import User
from invenio_accounts.testutils import login_user_via_session
from invenio_db import db
from invenio_pidstore.models import PersistentIdentifier, PIDStatus

from invenio_app_ils.records.api import Item


def mint_record_pid(pid_type, pid_field, record):
    """Mint the given PID for the given record."""
    PersistentIdentifier.create(
        pid_type=pid_type,
        pid_value=record[pid_field],
        object_type="rec",
        object_uuid=record.id,
        status=PIDStatus.REGISTERED,
    )
    db.session.commit()


def internal_location_ref_builder(app, item_pid):
    """Ref builder for item InternalLocation."""
    path = Item._internal_location_resolver_path
    return path.format(
        scheme=app.config["JSONSCHEMAS_URL_SCHEME"],
        host=app.config["JSONSCHEMAS_HOST"],
        item_pid=item_pid,
    )


def document_ref_builder(app, item_pid):
    """Ref builder for item Document."""
    path = Item._document_resolver_path
    return path.format(
        scheme=app.config["JSONSCHEMAS_URL_SCHEME"],
        host=app.config["JSONSCHEMAS_HOST"],
        item_pid=item_pid,
    )


def user_login(client, user, users):
    """Util function to log in user."""
    user_logout(client)
    if user != "anonymous":
        user = User.query.get(users[user].id)
        login_user_via_session(client, user)
        return user


def user_logout(client):
    """Util function to log out user."""
    with client.session_transaction() as sess:
        if "user_id" in sess:
            del sess["user_id"]


def validate_data(key, expected_output, res):
    """Util function for testing output data."""
    if res.status_code != 403 and res.status_code != 401:
        data = json.loads(res.data.decode("utf-8"))["metadata"]
        assert data[key] == expected_output


def validate_response(client, req_method, url, headers, data,
                      expected_resp_code):
    """Util function testing response code."""
    if data:
        res = getattr(client, req_method)(
            url, headers=headers, data=json.dumps(data)
        )
    else:
        res = getattr(client, req_method)(url, headers=headers)
    assert expected_resp_code == res.status_code
    return res
