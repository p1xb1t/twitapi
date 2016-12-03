# getting images

## how to use

`npm i`.

If you connect `localhost:3000` with WebSocket and send some messages, you can get JSON string with image paths.

ex.
```
{
  "0":{
    "path":"/Users/[user_name]/[path]/twitter_img/0.jpg"
  }
}
```
### Twitter

`npm run twitter [search_word]`

Images named `[0-14].jpg` have been saved in `twitter_img`.

### Instagram

`npm run insta`

Images named `[0-19].jpg` have been saved in `insta_img`.
