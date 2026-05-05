# Changelog

All notable changes to this project will be documented in this file. See [commit-and-tag-version](https://github.com/absolute-version/commit-and-tag-version) for commit guidelines.

# 0.23.0 (2026-05-05)


### ✅ Tests

* **collection**: Update view model expectations 9ea4051


### ✨ Features

* **collection**: Add clear and reset controls 4b4eea9
* **collection**: Add failing empty-state action tests 886a7c3
* **collection**: Add recovery actions to empty states 7bb4510
* **collection**: Show category hint in collection rows 99f2fa2
* **saved-find**: Confirm before delete 4f45a35
* **saved-find**: Delete without confirm or redirect f6a912a


### 🐛 Bug Fixes

* **saved-find**: Show delete confirmation on web 568b557


### 📝 Documentation

* **agile**: Plan sprint 21 da65041
* **kanban**: Move sprint 21 to review 908b382
* **release**: Close sprint 20 1363233





# 0.22.0 (2026-05-05)


### ✨ Features

* **collection**: Add search and filters e64a181


### 🎫 Chores

* **git**: Ignore Trae artifacts 2a54969
* **ios**: Sync pods 8bb12df


### 📝 Documentation

* **agile**: Add sprint 19 tracking 6103403
* **agile**: Update delivery plan 191bac4
* **agile**: Update epics and board 8751d9c
* **release**: Record sprint 20 gate 6cc2c55





# 0.21.0 (2026-05-04)


### ✨ Features

* **learn**: Add search + nicer titles e7af8cb





# 0.20.0 (2026-05-04)


### ✨ Features

* **saved**: Add navigation actions 641e0ec
* **saved**: Persist photos on save 75f6c26
* **settings**: Persist save-photos toggle 7d585fe


### 🎫 Chores

* **deps**: Add expo-image-manipulator 602e40e





# 0.19.0 (2026-05-04)


### ✨ Features

* **analysis**: Make confidence thresholds explicit faa40d1
* **analytics**: Add local event log 211e144


### 🎫 Chores

* **agile**: Roll Sprint 15 to done 669c445


### 📝 Documentation

* **agile**: Start Sprint 16 88746b3





# 0.18.0 (2026-05-04)


### ✨ Features

* **analysis**: Add analyzer selection flag c48ca60


### 🐛 Bug Fixes

* **analysis**: Read EXPO_PUBLIC analyzer flag c123377
* **clip**: Avoid expo-file-system on web 3752b9a


### 📝 Documentation

* **s15**: Record iOS real-engine log 291d5da





# 0.17.0 (2026-05-04)


### ♻ Code Refactoring

* **analysis**: Add on-device encoder seam 3479e70


### ⚡ Performance Improvements

* **analysis**: Record inference diagnostics 0b49c5e


### ✨ Features

* **analysis**: Select photo encoder 465c1f7
* **clip**: Add async analyzer factory 2ea9205
* **clip**: Add convenient photo uri embedder 2d3c821
* **clip**: Embed photo URI bytes 799d133
* **s14**: On-device ONNX encoder seam b42d931
* Add on-device embedding helper a5f2c5d
* Bootstrap on-device encoder bc8b02d
* Make analysis async acf6358
* Onnx image encoder adapter 4f10a2a
* Onnx-backed on-device encoder 372e868
* Read photo bytes 4553fd9
* Store analysis for results 7f5a27c
* Use photo analysis by default 397b0e8
* Use photo embedding when evidence exists c5b4679


### 🎫 Chores

* **agile**: Roll Sprint 14 to done 70bfe8d
* **dev**: Log analysis diagnostics 33ee982
* **docs**: Record s14 device notes 027a8d0
* **expo**: Add dev client 3ca4491
* **ios**: Sync pods for expo modules 476dd80
* **s14**: Bundle SqueezeNet ONNX model ccbc3e7
* Update kanban for s14 ac78704
* Update kanban photo analysis 5e271f7
* Update kanban photo default b1cf7a7
* Update kanban policy 7abaf38
* Update kanban s14 embedding eeea031
* Update kanban s14 progress 57e9a17


### 🐛 Bug Fixes

* **analysis**: Gate photo preview mode 47ddd94
* Remove default observations 8d594f8


### 📝 Documentation

* **s14**: Record iOS on-device latency 02711e4
* **s14**: Widen iOS latency sample 38e1eae
* Update kanban ef71901
* Update kanban 54970e8
* Update kanban d429dac
* Update kanban e246258





# 0.16.0 (2026-05-03)


### ✅ Tests

* **clip**: Add index-backed retrieval acceptance 59af6fd
* **clip**: Eval uses index artifact 327caf8
* Accept bytes index-backed retrieval d71d150


### ✨ Features

* **clip**: Add index artifact loader 798f7ae
* **clip**: Add index generator pipeline da1642e
* Add bytes embedder demo pipeline 10c1fdf


### 🎫 Chores

* **husky**: Bump only on sprint merges cc2b371


### 🐛 Bug Fixes

* **husky**: Skip bump on sprint branches 3024bf9


### 📝 Documentation

* **dev**: Adopt sprint branch release flow 0916d7d
* **kanban**: Sync sprint 13 next steps 9d14c2d





## 0.15.1 (2026-05-03)


### ✅ Tests

* **eval**: Compare clip knn analyzer via eval e6cd734





# 0.15.0 (2026-05-03)


### ✨ Features

* **clip**: Adapt retrieval to analyzer contract c5d2229





## 0.14.1 (2026-05-03)


### ✅ Tests

* **clip**: Add retrieval acceptance gate 30f1a7e





# 0.14.0 (2026-05-03)


### ✨ Features

* **clip**: Add cosine kNN foundation aa74761





# 0.13.0 (2026-05-03)


### ♻ Code Refactoring

* **eval**: Clarify dataset report calculation 085c537


### ✅ Tests

* **eval**: Pass dataset expansion acceptance ad8c0f0


### ✨ Features

* **eval**: Add failing acceptance test for dataset expansion 7dceb92


### 🐛 Bug Fixes

* **eval**: Define top3 as first three matches e36e802


### 📝 Documentation

* **agile**: Add sprint 12-15 core ID plan 078508c





# 0.12.0 (2026-05-03)


### ✅ Tests

* **eval**: Test-pass rock id eval contract 4d063c2


### ✨ Features

* **eval**: Add failing acceptance test for rock id reality check d6688ce


### 📝 Documentation

* **agile**: Close sprint 11 reality check findings 46597de





# 0.11.0 (2026-05-03)


### ✅ Tests

* **e2e**: Define market offer acceptance 885ba87


### ✨ Features

* **capture**: Reinforce tips messaging 2807a47
* **home**: Add market offer messaging a588c36
* **results**: Clarify trust and remove mock disclaimer b6e74a9


### 📝 Documentation

* **agile**: Plan sprint 11 rock id reality check 1355d44
* **sprint**: Add sprint 10 plan for market offer messaging a1b2150





# 0.10.0 (2026-05-02)


### ♻ Code Refactoring

* **results**: Extract clarity and action render helpers 55f3aa4


### ✅ Tests

* **results**: Test-pass low-confidence clarity variant f6a7306


### ✨ Features

* **results**: Add failing acceptance test for low-confidence clarity 1fa66e7


### 📝 Documentation

* **agile**: Close sprint 9 with web and iphone QA evidence 523401e
* **agile**: Open sprint 9 results clarity tracking 0ac80e4





# 0.9.0 (2026-05-02)


### ✅ Tests

* **feedback**: Mark result feedback as acceptance c18616c


### ✨ Features

* **feedback**: Describe result usefulness acceptance f2f0a6f
* **feedback**: Record result usefulness feedback b4826af
* **feedback**: Test-pass core flow usefulness feedback 5ea4457
* **feedback**: Test-pass result usefulness prompt deb60ab


### 📝 Documentation

* **agile**: Close sprint 8 tracking with QA evidence b605397
* **agile**: Plan sprint 8 field testing 1404999





## 0.8.2 (2026-05-02)


### 🎫 Chores

* **ios**: Sync worklets pod lockfile 1442c7f


### 📝 Documentation

* **agile**: Reorganize delivery workspace 8d666fd





## 0.8.1 (2026-05-02)


### 🎫 Chores

* **deps**: Align worklets with Expo SDK d3810d7


### 📝 Documentation

* **agile**: Start S7 Expo compatibility c935e22





# 0.8.0 (2026-05-02)


### ♻ Code Refactoring

* **home**: Extract recent finds limit constant b0f7651


### ✅ Tests

* **e2e**: Stabilize saved detail assertion bdf9f84


### ✨ Features

* **home**: Add failing acceptance test for recent finds eea2ac7
* **home**: Add failing tie-break acceptance test b86c2c4
* **home**: Deterministic recent-find tie ordering 86b6323
* **home**: Test-pass recent finds 0b4177d


### 🎫 Chores

* **ios**: Sync pods for async storage 7c5237f


### 📝 Documentation

* **agile**: Record Sprint 6 manual QA fd750e4
* **agile**: Track Sprint 6 recent finds e101551
* **s5**: Record iPhone QA + mark S5-1 done a7ffbe1
* **workflow**: Feat for ATDD acceptance tests 8b75ac5





## 0.7.5 (2026-05-02)


### ✅ Tests

* **saved**: Add failing delete ab36dae
* **saved**: Test-pass delete saved find 067ff0f


### 📝 Documentation

* **s5**: Mark S5-2 done 0002dc9





## 0.7.4 (2026-05-02)


### ♻ Code Refactoring

* **docs**: Collapse old sprints e56b8c9
* **docs**: Move kanban to dedicated file a5066d2
* **docs**: Restructure sprints 4-5 15cf2c2
* **saved**: Extract storage resolver a1ed554
* **saved**: Simplify persistence writes 2863366


### ✅ Tests

* **saved**: Add failing context persistence 61000d3
* **saved**: Add failing persistence 894ae1f
* **saved**: Add failing provider persistence bf810fc
* **saved**: Test-pass context persistence 09a1ea2
* **saved**: Test-pass persistence module c1e4d82
* **saved**: Test-pass provider persistence f13ef2e


### 📝 Documentation

* **kanban**: Add live board e83b379
* **s5**: Add manual QA log template 8dbf2e5
* **s5**: Define persistence sprint e6262a2
* **s5**: Update tracking after wiring 6e49a98
* **s5**: Update tracking for persistence 0894abc





## 0.7.3 (2026-05-02)


### ✅ Tests

* **workflow**: Require e2e before bump 6df9c25





## 0.7.2 (2026-05-02)


### ✅ Tests

* **e2e**: Add playwright smoke 66c06be


### 📝 Documentation

* **retro**: Capture TDD + e2e gaps bb1aa6c





## 0.7.1 (2026-05-02)


### 🐛 Bug Fixes

* **tabs**: Hide learn topic route 51da53a





# 0.7.0 (2026-05-02)


### ✅ Tests

* **learn**: Add failing topic route model 27c91e9


### ✨ Features

* **learn**: Add topic detail route ade77db





# 0.6.0 (2026-05-02)


### ✅ Tests

* **analytics**: Add failing stub contract 2cddabe


### ✨ Features

* **analytics**: Add track stub a438dc5
* **analytics**: Wire baseline events 134de68


### 📝 Documentation

* **s4**: Add S4-1 tracking ab1ba96





# 0.5.0 (2026-05-02)


### ✨ Features

* **review**: Add image quality hints 28928ca


### 📝 Documentation

* **workflow**: Document merge bump continue 6dd7f68





## 0.4.1 (2026-05-02)


### 🎫 Chores

* **release**: Auto bump on merge 56bf56e


### 🐛 Bug Fixes

* **husky**: Bump on ff merges 4ddbbe9
* **saved**: Persist and navigate on save result 7956c4c





# 0.4.0 (2026-05-02)


### ♻ Code Refactoring

* **analysis**: Clarify mock result rules 221fa99
* **saved-finds**: Harden saved find factory cb26ab8
* **saved-finds**: Replace duplicate saves 8436663
* **ui**: Reuse photo thumbnail 4b8bce6


### ✅ Tests

* **analysis**: Add low-confidence acceptance case 1b56fcd
* **collection**: Add saved finds view model case 8129bd3
* **s3**: Add failing collection thumbnail ATDD bfa366c
* **s3**: Add failing saved detail missing-image ATDD 3b89596
* **saved-finds**: Add saved find model case 36ea1b3
* **saved-finds**: Add saved find store case ed7a81d


### ✨ Features

* **analysis**: Add low-confidence mock result 1bcb460
* **collection**: Add saved finds view model 2425ab9
* **collection**: Read saved finds from store cddc224
* **collection**: Show saved thumbnails 593b74c
* **saved-finds**: Add in-memory saved find store 24feaa9
* **saved-finds**: Add saved find model b0f057d
* **saved**: Handle missing image ee10952


### 📝 Documentation

* **agile**: Mark S2-4 done f1f0c97
* **agile**: Mark S3-1 done 63244a9
* **agile**: Mark S3-2 done 724623b
* **agile**: Mark S3-3 done e62cc6f
* **agile**: Mark S3-4 done a5eed72
* **s3**: Define DoD checklist 1baca65





# 0.3.0 (2026-05-02)


### ♻ Code Refactoring

* Clarify photo input library selection b0115ef
* Simplify photo input result flow 814382b


### ✨ Features

* **analysis**: Add typed mock result service 74b73a4
* **session**: Persist image + observations 00dad4f
* Implement camera capture flow for S1-2 bfbde5f
* Mount gallery upload flow in app a5d2b4b
* Scaffold Expo rock ID app 203b359


### 🎫 Chores

* **ios**: Add prebuilt iOS project 3dae2e8
* **tooling**: Add commitizen gitmoji 70c92dc
* **tooling**: Setup husky hooks f53be6b
* **version**: Add commitizen bump tooling 3399a23
* **version**: Track MVP build as v0.2.0 963b6d6
* Use automatic React JSX runtime fa90238


### 👷 Build System

* Add jsx compiler option for React support 753e3f2


### 📝 Documentation

* Add agile delivery plan for rock id mvp development 62ba1f5
* Add initial product documentation suite 600e48d
* Add next-driver development workflow guide 57adacc
* Add project README 261bd25
* Add sprint 1 manual QA log template b41af7b
* Add sprint tracking and relative doc links 67cb6f4
* Update agile delivery plan with manual QA results d416035
