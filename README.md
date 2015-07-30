# Tink split view Angular directive

v1.0.0

## What is this repository for?

The Tink Angular identity card number directive provides you with an input field preformatted for Belgian identity card numbers.

Tink is an in-house developed easy-to-use front-end framework for quick prototyping and simple deployment of all kinds of websites and apps, keeping a uniform and consistent look and feel.

## Setup

### Prerequisites

* nodeJS [http://nodejs.org/download/](http://nodejs.org/download/)
* bower: `npm install -g bower`

### Install

1. Go to the root of your project and type the following command in your terminal:

   `bower install tink-split-view-angular --save`

2. Add the following files to your project:

   `<link rel="stylesheet" href="bower_components/tink-core/dist/tink.css" />` (or one of the Tink themes)

3. Add `tink.identitycardnumber` to your app module's dependency.

   `angular.module('myApp', ['tink.split-view']);`



----------



## How to use

### tink-split-view

```html
<tink-master-detail-view tink-init-size="30"  tink-split-view-direction="vertical">

  <tink-list-view data-item-change="changeData($active)" tink-active-item="activeItem.id">
          <tink-master-detail-view tink-init-size="10"  tink-split-view-direction="horizontal" class="fixed-checkboxes">
            <tink-list-view>
              <div class="list-mailbox-options">
                <div class="container">
                  <div class="row">
                    <div class="col-xs-12">
                      <div class="radio checkbox-inline">
                        <input type="radio" id="docsradio1" data-ng-model="filters" data-ng-value="{}" data-ng-checked="true" data-ng-change="triggerFilter(filters)" name="docsradio">
                        <label for="docsradio1">Alle documenten</label>
                      </div>
                      <div class="radio checkbox-inline">
                        <input type="radio" id="docsradio2" data-ng-model="filters" data-ng-value="{eid:false}" data-ng-change="triggerFilter(filters)" name="docsradio">
                        <label for="docsradio2">Zonder eID</label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </tink-list-view>
            <tink-content-view>
              <ul class="list-mailbox">
                <li data-ng-repeat="message in messages | filter:filters | filter:extraFilters"  data-tink-list-item="message.id" data-ng-class="{'unread': message.unread}">
                  <a title="{{message.title}} - {{message.description}}">
                    <div>
                      <span class="list-mailbox-icons"><span class="badge-warning" data-ng-if="message.eid">eID</span></span>
                      <span class="list-mailbox-category">{{message.category}}</span>
                      <span class="list-mailbox-title">{{message.title}}</span>
                    </div>
                    <span class="list-mailbox-description">{{message.description}}</span>
                  </a>
                </li>
              </ul>
                </tink-content-view>
    </tink-master-detail-view>
  </tink-list-view>
  <tink-content-view>
          <tink-master-detail-view tink-init-size="89" tink-split-view-direction="horizontal">
            <tink-list-view>
              <div class="container">
                <div class="row">
                  <div class="col-xs-12">
                    <div ng-if="selectedMessage !== undefined">
                      <h1 ng-bind-html="selectedMessage.title"></h1>
                      <div ng-bind-html="selectedMessage.message"></div>
                    </div>
                    <div ng-if="selectedMessage === undefined">
                      <p class="mailbox-loader text-center"><i class="fa fa-refresh fa-spin"><span class="sr-only">Loading…</span></i></p>
                    </div>
                  </div>
                </div>
              </div>
            </tink-list-view>
            <tink-content-view>
              <div class="container">
                <div class="row vertical-align-middle margin-bottom margin-top">
                  <div class="col-xs-6">
                    <button class="btn-primary">Handtekenen</button>
                    <!-- <button data-ng-click="activeItem.id=activeItem.id+1;" data-ng-if="extraFilters=={}" data-ng-disabled="selectedMessage[$index+1]=undefined">Volgend bericht</button> -->
                  </div>
                  <div class="col-xs-6 text-right">
                    Te ondertekenen tegen: <strong>vandaag</strong>
                  </div>
                </div>
              </div>
            </tink-content-view>
          </tink-master-detail-view>
  </tink-content-view>
</tink-master-detail-view>
```
tink-init-size="30"  tink-split-view-direction="vertical"
### Options

Attr | Type | Default | Details
--- | --- | --- | ---
data-tink-init-size | `number` | `undefined` | The init size of the view in px.
data-tink-split-view-direction (required)| 'vertical|horizontal' | '' | The direction of the view.
data-tink-is-resizable | 'boolean' | true | If you can resize the view or not.

###Example

A working example can be found in [the Tink documentation](http://tink.digipolis.be/#/docs/directives/split-view#example).

## Contribution guidelines

* If you're not sure, drop us a note
* Fork this repo
* Do your thing
* Create a pull request

## Who do I talk to?

* Jasper Van Proeyen - jasper.vanproeyen@digipolis.be - Lead front-end
* Tom Wuyts - tom.wuyts@digipolis.be - Lead UX
* [The hand](https://www.youtube.com/watch?v=_O-QqC9yM28)
