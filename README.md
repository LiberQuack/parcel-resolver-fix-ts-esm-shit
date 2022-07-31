# parcel-resolver-fix-ts-esm-shit

## TLDR
If you have errors because you are including `.js` in the end of your imports when using typescript,
install this package by running

```
npm install --save-dev parcel-resolver-fix-ts-esm-shit
```

Then you will need to customize your .parcelrc with

```json
{
  "extends": "@parcel/config-default",
  "resolvers": ["parcel-resolver-fix-ts-esm-shit", "..."]
}
```


## The Problem
Are you using javascript modules and typescript? Yeah, so now you have to put `.js` in the end
of your imports, once it your code needs to be esm complaint.

## The Fix
This package takes your `.js` imports and checks if a `.ts` or `.tsx` exists, 
if true, parcel will use your typescript