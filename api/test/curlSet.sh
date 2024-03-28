curl -X POST \
     -H "Authorization: ${VIZHUB_API_KEY}" \
     -F "file=@vizhub-export.zip" \
     http://localhost:5173/api/set-viz/curran/awesome