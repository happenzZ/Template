# -*- coding: utf-8 -*-
import time
import json
import os
import sys
import cv2

try:
    import GlobalVariable as GV
except ImportError:
    import app.dataService.GlobalVariable as GV

class DataService(object):
    def __init__(self):
        self.GV = GV
        print('=================================================')
        return

    def initialization(self, video_id):
        self.video_id = video_id
        result = {'test': 'test'}
        return result

    def test(self):
        print(self.GV.test)
    
    def get_video_info(self, video_id):
        video_path = os.path.join(GV.VIDEO_FOLDER, '{}.mp4'.format(video_id))
        try:
            capture = cv2.VideoCapture(video_path)
        except:
            print('something wrong with video_path')
            return {}
        if not capture.isOpened():
            print("could not open :", video_path)
            return {}
        else:
            total_frame = int(capture.get(cv2.CAP_PROP_FRAME_COUNT))
            video_width = int(capture.get(cv2.CAP_PROP_FRAME_WIDTH))
            video_height = int(capture.get(cv2.CAP_PROP_FRAME_HEIGHT))
            fps = capture.get(cv2.CAP_PROP_FPS)

            video_info = {
                'totalFrmNum': total_frame,
                'videoWidth': video_width,
                'videoHeight': video_height,
                'fps': fps,
                'videoId': video_id,
                'videoPath': video_path,
                'type': 'mp4'
            }
        return video_info

    def get_pose_data(self, video_id):
        with open('{}/{}.json'.format(GV.POSE_FOLDER, video_id), 'r') as rf:
            result = json.load(rf)
        return result



if __name__ == '__main__':
    print('start')
    dataService = DataService()




