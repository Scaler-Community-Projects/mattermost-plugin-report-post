/* eslint-disable no-console */
import {Component} from 'react';
import {v4 as uuidv4} from 'uuid';

import {getPost} from 'mattermost-redux/selectors/entities/posts';
import {getCurrentUser, getUser} from 'mattermost-redux/selectors/entities/users';
import {Client4} from 'mattermost-redux/client';

import {id as pluginId} from './manifest';
import {botId, channelId} from './ids';

// eslint-disable-next-line react/require-optimization
class ReportPlugin extends Component {
    initialize(registry, store) {
        registry.registerPostDropdownMenuAction('Report', (postId) => {
            const state = store.getState();
            const post = getPost(state, postId);
            console.log(post);
            const currentUser = getCurrentUser(state);
            const user = getUser(state, post.user_id);
            const newPost = {
                pending_post_id: uuidv4(),
                user_id: botId,
                channel_id: channelId,
                message: '',
                props: {
                    attachments: [{
                        text: 'Report Alert:-\n\tReported: ' + user.first_name + ' ' + user.last_name + '\n\tReported Username: ' + user.username + '\n\tReported Email: ' + user.email +
                        '\n\tReported By: ' + currentUser.username + '\n\tReported Text ID: ' + post.id + '\n\nReported Text:-\n' + post.message + '\n',
                    }],
                },
            };
            Client4.createPost(newPost);
        });
    }

    uninitialize() {
        console.log(pluginId + '::uninitialize()');
    }
}

export default ReportPlugin;