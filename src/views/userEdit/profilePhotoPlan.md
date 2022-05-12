# Proflie photo plan

## TODO's

- [ ] Add a image cropper/editor
- [ ] Add a v-dialog to offer upload a file or add a URL (low priority)
- [X] Connect w/ firebase storage
- [X] Create a folder for the user profile photo (maybe user non relevant crap)
- [ ] Webcam capabilities
- [ ] REST service for profiel data (let's start only with the profile photo)
- [X] File input with preview

### profilePhoto URL

Make an end point ot GET the profile photo

The endpoint must have a function that retrieves the file from the user.

#### Gotchas

Maybe limit access to it, but what for ?

I feel like I should but can not tell why.

The uploaded file if it has a different extension is stored as such and at the current moment we are not making any distintion, which turns out to have duplicity.

A good solution is to convert the uploaded file with a function as soon as it is uploaded and delete anyother file of the kind in the bucket directory

> 10042022

#### DO's

- Use the license
- throttle
- rename the file so it hides the UID

#### DONT's

- Use or return by any means the UID
- Only GET no other verb at all


