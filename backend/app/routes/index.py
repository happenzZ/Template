'''
    The RESTful style api server
'''
from pprint import pprint

from app import app
from app import dataService

import json
import numpy as np
import os
import re
import logging
import mimetypes
import subprocess

from flask import send_file, request, jsonify, render_template, send_from_directory, Response

LOG = logging.getLogger(__name__)

MB = 1 << 20
BUFF_SIZE = 10 * MB

def partial_response(path, start, end=None):
    LOG.info('Requested: %s, %s', start, end)
    file_size = os.path.getsize(path)

    # Determine (end, length)
    if end is None:
        end = start + BUFF_SIZE - 1
    end = min(end, file_size - 1)
    end = min(end, start + BUFF_SIZE - 1)
    length = end - start + 1

    # Read file
    with open(path, 'rb') as fd:
        fd.seek(start)
        bytes = fd.read(length)
    assert len(bytes) == length

    response = Response(
        bytes,
        206,
        mimetype=mimetypes.guess_type(path)[0],
        direct_passthrough=True,
    )
    response.headers.add(
        'Content-Range', 'bytes {0}-{1}/{2}'.format(
            start, end, file_size,
        ),
    )
    response.headers.add(
        'Accept-Ranges', 'bytes'
    )
    LOG.info('Response: %s', response)
    LOG.info('Response: %s', response.headers)
    return response

def get_range(request):
    range = request.headers.get('Range')
    LOG.info('Requested: %s', range)
    m = re.match('bytes=(?P<start>\d+)-(?P<end>\d+)?', range)
    if m:
        start = m.group('start')
        end = m.group('end')
        start = int(start)
        if end is not None:
            end = int(end)
        return start, end
    else:
        return 0, None

# ################################################################################ route
@app.route('/')
def index():
    print('main url!')
    return json.dumps('/')
    # return render_template('index.html')

@app.route('/test')
def test():
    return json.dumps('test')

@app.route('/initialization/<video_id>')
def _initialization(video_id):
    result = dataService.initialization(video_id)
    return json.dumps(result)

# show image url
@app.route('/image/<video_id>/<person_id>')
def _getImage(video_id, person_id):
    image_path = os.path.join(dataService.GV.DATA_FOLDER, '{}/{}.jpg'.format(video_id, person_id))
    return send_file(image_path, mimetype='image/jpg')

# show video url
@app.route('/video/<video_id>')
def _get_video(video_id):
    video_id = str(video_id)
    video_foler = dataService.GV.VIDEO_FOLDER
    # print('video_foler: ', video_foler)
    video_path = os.path.join(video_foler, '{}.mp4'.format(video_id))
    start, end = get_range(request)
    return partial_response(video_path, start, end)

@app.route('/videoInfo/<video_id>')
def _get_video_info(video_id):
    result = dataService.get_video_info(video_id)
    return json.dumps(result)

@app.route('/pose/<video_id>')
def _get_pose_data(video_id):
    result = dataService.get_pose_data(video_id)
    return json.dumps(result)

@app.route('/vision/<video_id>')
def _get_vision_data(video_id):
    video_info = dataService.get_video_info(video_id)
    pose_data = dataService.get_pose_data(video_id)
    result = {
        'videoInfo': video_info,
        'poseData': pose_data
    }
    return json.dumps(result)


if __name__ == '__main__':
    pass
