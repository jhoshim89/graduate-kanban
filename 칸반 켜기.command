#!/bin/bash
# 졸업 칸반 켜기 — 이 창을 닫으면 칸반도 꺼집니다.
cd "/Users/js-mac/Projects/graduate-kanban" || { echo "프로젝트 폴더를 못 찾음"; read; exit 1; }
echo "졸업 칸반을 켜는 중... (다 쓰면 이 창을 닫으세요)"
( sleep 2 && open "http://localhost:5173" ) &
exec npm run dev
