# Component/entity index — LoveKGD synthesis v0.1

Всего сущностей: **111**. Penpot-eligible: **91**. Все записи reconstructed, candidate, unaccepted и not promotion-ready.

## foundation — 6

| ID | Название | Penpot | Source implementations |
|---|---|---:|---|
| `foundation.iconography` | Iconography roles | yes | — |
| `foundation.interaction-accessibility` | Interaction and accessibility | yes | — |
| `foundation.media-policy` | Media policy | yes | — |
| `foundation.motion` | Motion | yes | — |
| `foundation.spacing-layout` | Spacing and layout roles | yes | — |
| `foundation.typography-roles` | Typography roles | yes | — |

## primitive_component — 1

| ID | Название | Penpot | Source implementations |
|---|---|---:|---|
| `core.icon` | Icon | yes | `site/src/components/Icon.astro`<br>`site/src/components/SocialIcon.astro` |

## control_component — 11

| ID | Название | Penpot | Source implementations |
|---|---|---:|---|
| `core.button` | Button | yes | `site/src/components/design-system/Button.astro` |
| `core.calendar-action` | Calendar action | yes | `site/src/components/CalendarLink.astro`<br>`site/src/components/DesktopEventActionPanel.astro` |
| `core.copy-action` | Copy action | yes | `site/src/components/design-system/CopyAction.astro` |
| `core.favorite-action` | Favorite action | yes | `site/src/components/DesktopEventActionPanel.astro` |
| `core.field` | Field | yes | `site/src/components/design-system/Field.astro` |
| `core.pwa-install-action` | PWA install action | yes | `site/src/components/FocusPwaInstallAction.astro`<br>`site/src/components/PwaInstallAction.astro` |
| `core.share-action` | Share action | yes | `site/src/components/DesktopEventActionPanel.astro`<br>`site/src/components/ServiceShareAction.astro` |
| `event.primary-action` | Event primary action | yes | `site/src/components/DesktopEventActionPanel.astro` |
| `listing.category-filter` | Listing category filter | yes | `site/src/components/listings/PopularCategoryFilter.astro` |
| `listing.density-switch` | Listing density switch | yes | `site/src/components/listings/ListingMobileDensitySwitch.astro` |
| `personalization.filter` | Personal listing filter | yes | `site/src/components/ListingPersonalFilter.astro` |

## navigation_component — 7

| ID | Название | Penpot | Source implementations |
|---|---|---:|---|
| `core.breadcrumbs` | Breadcrumbs | yes | `site/src/components/Breadcrumbs.astro` |
| `event.occurrence-selector` | Event occurrence selector | yes | `site/src/components/EventOccurrenceNav.astro` |
| `home.quick-navigation` | Home quick navigation | yes | `site/src/components/HomeQuickNav.astro` |
| `listing.range-navigation` | Listing range navigation | yes | `site/src/components/listings/WeekendRangeNav.astro` |
| `listing.time-navigation` | Listing time navigation | yes | `site/src/components/listings/ListingTimeNav.astro`<br>`site/src/components/listings/ListingWeekendTimeNav.astro` |
| `navigation.mobile-tab-item` | Mobile tab item | yes | — |
| `navigation.search-context-links` | Search collection links | yes | `site/src/components/SearchCollectionLinks.astro` |

## content_component — 20

| ID | Название | Penpot | Source implementations |
|---|---|---:|---|
| `brand.wordmark` | Announcements wordmark | yes | `site/src/components/brand/AnnouncementsWordmark.astro` |
| `club.card` | Interest club card | yes | `site/src/components/InterestClubCard.astro` |
| `core.badge` | Badge | yes | `site/src/components/FocusLabBadge.astro`<br>`site/src/components/design-system/Badge.astro` |
| `core.state-panel` | State panel | yes | `site/src/components/design-system/StatePanel.astro` |
| `event.admission-summary` | Admission summary | yes | `site/src/components/DesktopEventActionPanel.astro` |
| `event.fact-row` | Event fact row | yes | — |
| `event.fallback-art` | Event fallback art | yes | `site/src/components/EventFallbackArt.astro` |
| `event.hero-summary` | Event hero summary | yes | `site/src/components/EventHero.astro` |
| `event.media-frame` | Event media frame | yes | `site/src/components/EventHero.astro` |
| `event.occurrence-label` | Event occurrence label | yes | `site/src/components/EventOccurrenceLabel.astro` |
| `event.participants` | Event participants | yes | `site/src/components/EventParticipants.astro` |
| `event.question-cta` | Event question CTA | yes | `site/src/components/EventQuestionCta.astro` |
| `focus.invite-share` | Focus invite share | yes | `site/src/components/FocusGroupInviteShare.astro` |
| `focus.thank-you` | Focus thank-you | yes | `site/src/components/FocusGroupThankYou.astro` |
| `listing.date-accessory` | Mobile date accessory | yes | `site/src/components/listings/MobileDateAccessory.astro` |
| `listing.group-context` | Popular group context | yes | `site/src/components/listings/PopularMobileGroupContext.astro` |
| `listing.time-marker` | Listing time marker | yes | `site/src/components/listings/ListingTimeMarker.astro` |
| `talk.message` | Product/promo talk message | yes | `site/src/components/HomeHeroTalk.astro` |
| `transport.journey-alerts` | Transport journey alerts | yes | `site/src/components/transport/TransportJourneyAlerts.astro` |
| `transport.route-heading` | Transport route heading | yes | `site/src/components/transport/TransportRouteHeading.astro` |

## composite_component — 22

| ID | Название | Penpot | Source implementations |
|---|---|---:|---|
| `brand.lockup` | Announcements lockup | yes | `site/src/components/brand/AnnouncementsLockup.astro` |
| `core.dialog` | Dialog | yes | — |
| `core.rail` | Content rail | yes | — |
| `core.toast-region` | Toast region | yes | `site/src/components/MobileToastRegion.astro` |
| `event.action-group` | Event action group | yes | `site/src/components/DesktopEventActionPanel.astro`<br>`site/src/components/EventHero.astro` |
| `event.card` | Event card | yes | `site/src/components/EventCard.astro`<br>`site/src/components/listings/ListingEventCard.astro` |
| `event.fact-list` | Event fact list | yes | `site/src/components/EventFacts.astro` |
| `event.hero-composition` | Event hero composition | yes | `site/src/components/EventHero.astro` |
| `event.media-rail` | Event media rail | yes | `site/src/components/EventMediaRail.astro` |
| `event.media-viewer` | Event media viewer | yes | `site/src/components/EventHero.astro` |
| `event.summary-action-panel` | Event summary action panel | yes | `site/src/components/EventCtaPanel.astro` |
| `listing.behavior-row` | Popular behavior row | yes | `site/src/components/listings/PopularBehaviorRows.astro`<br>`site/src/components/listings/PopularMobileAdaptiveRows.astro`<br>`site/src/components/listings/PopularMobileBehaviorRows.astro` |
| `listing.controls` | Listing controls | yes | `site/src/components/listings/ListingControls.astro` |
| `listing.page-header` | Listing page header | yes | `site/src/components/listings/ListingPageHeader.astro` |
| `listing.personalized-row` | Popular personalized row | yes | `site/src/components/listings/PopularPersonalizedRow.astro` |
| `listing.rail-row` | Listing rail row | yes | `site/src/components/listings/MobileListingRailRow.astro` |
| `navigation.mobile-menu` | Mobile menu | yes | `site/src/components/Reference4MobileMenu.astro` |
| `navigation.mobile-tab-bar` | Mobile tab bar | yes | `site/src/components/MobileBottomNav.astro` |
| `site.footer` | Site footer | yes | `site/src/components/SiteFooter.astro` |
| `transport.bus-schedule` | Bus event schedule | yes | `site/src/components/EventBusTransportSchedule.astro` |
| `transport.kaup-schedule` | KAUP transfer schedule | yes | `site/src/components/KaupTransportSchedule.astro` |
| `transport.rail-schedule` | Rail event schedule | yes | `site/src/components/EventTransportSchedule.astro` |

## product_pattern — 14

| ID | Название | Penpot | Source implementations |
|---|---|---:|---|
| `artifact.collection` | Artifact collection | yes | `site/src/components/artifacts/ArtifactCollection.astro` |
| `event.card-grid` | Event card grid | yes | `site/src/components/OptimizedEventCardGrid.astro` |
| `exhibitions.personal-surface` | Exhibitions personal surface | yes | `site/src/components/ExhibitionsPersonalSurface.astro` |
| `favorites.surface` | Favorites surface | yes | `site/src/components/FavoritesSurface.astro` |
| `focus.diagnostic` | Focus connectivity diagnostic | yes | `site/src/components/FocusConnectivityDiagnostic.astro` |
| `focus.feedback-form` | Focus feedback form | yes | `site/src/components/FocusGroupFeedback.astro` |
| `focus.invite-intake` | Focus invite intake | yes | `site/src/components/FocusGroupInviteIntake.astro` |
| `home.cold-start-feed` | Home cold-start feed | yes | `site/src/components/HomeColdStartFeed.astro` |
| `interest.profile` | Interest profile | yes | `site/src/components/InterestProfile.astro` |
| `listing.discovery-rail` | Listing discovery rail | yes | `site/src/components/listings/ListingDiscoveryRail.astro`<br>`site/src/components/listings/MobileListingRailSurface.astro` |
| `listing.timeline` | Listing timeline | yes | `site/src/components/listings/ExactTimeTimeline.astro`<br>`site/src/components/listings/WeekendEditorialTimeline.astro`<br>`site/src/components/listings/WeekendTimeMatrix.astro` |
| `personal-feed.slot` | Personal feed slot | yes | `site/src/components/PersonalFeedSlot.astro` |
| `search.event-search` | Event search | yes | `site/src/components/AuthorizedEventSearch.astro` |
| `transport.schedule-region` | Event transport schedule region | yes | `site/src/components/EventTransportSchedule.astro`<br>`site/src/components/EventBusTransportSchedule.astro`<br>`site/src/components/KaupTransportSchedule.astro` |

## page_composition — 11

| ID | Название | Penpot | Source implementations |
|---|---|---:|---|
| `page.collection.free` | Free collection page | yes | `site/src/components/FreeCollectionSurface.astro` |
| `page.collection.gastronomy` | Gastronomy collection page | yes | `site/src/components/GastronomyCollectionSurface.astro` |
| `page.event-detail.editorial` | Event detail — editorial/landscape | yes | `site/src/components/DesktopEventPage.astro` |
| `page.event-detail.mobile` | Event detail — mobile | yes | — |
| `page.event-detail.no-image` | Event detail — no image | yes | `site/src/components/DesktopEventPage.astro` |
| `page.event-detail.split` | Event detail — portrait/poster split | yes | `site/src/components/DesktopEventPage.astro` |
| `page.listing-date` | Date listing page | yes | `site/src/components/listings/DateListingSurface.astro` |
| `page.listing-popular` | Popular listing page | yes | `site/src/components/listings/PopularListingSurface.astro` |
| `page.listing-unusual` | Unusual listing page | yes | `site/src/components/UnusualListingSurface.astro` |
| `page.listing-weekend` | Weekend listing page | yes | `site/src/components/listings/WeekendListingSurface.astro` |
| `page.prelaunch` | Prelaunch page | no | `site/src/components/PrelaunchPage.astro` |

## runtime_enabler — 9

| ID | Название | Penpot | Source implementations |
|---|---|---:|---|
| `navigation.keyboard-enhancement` | Keyboard navigation enhancement | no | `site/src/components/ClubCatalogKeyboard.astro`<br>`site/src/components/KeyboardEventNavigation.astro` |
| `runtime.club-catalog-navigation` | Club catalog navigation runtime | no | `site/src/components/clubCatalogNavigation.mjs` |
| `runtime.mobile-event-styles` | Mobile event production styles | no | `site/src/components/MobileEventProductionStyles.astro` |
| `runtime.onboarding-placement-context` | Onboarding placement context runtime | no | `site/src/components/onboarding/StandardOnboardingPlacementContext.astro` |
| `runtime.personalization` | Personalization runtime | no | `site/src/components/personalization/PersonalizationRuntime.astro` |
| `runtime.pwa-telemetry` | PWA telemetry | no | `site/src/components/PwaTelemetry.astro` |
| `runtime.static-auth` | Static site auth runtime | no | `site/src/components/auth/StaticSiteAuthRuntime.astro` |
| `runtime.unusual-unread` | Unusual unread runtime | no | `site/src/components/UnusualUnreadRuntime.astro` |
| `runtime.weather-date-context` | Weather/date context runtime | no | `site/src/components/WeatherDateContext.astro` |

## legacy_or_experiment — 5

| ID | Название | Penpot | Source implementations |
|---|---|---:|---|
| `artifact.rail-insert` | Artifact rail insert | no | `site/src/components/listings/AmberRailArtifact.astro` |
| `exhibition.row` | Exhibition row boundary | no | `site/src/components/ExhibitionPrototypeRow.astro` |
| `experiment.keyboard-navigation` | Keyboard navigation prototype | no | `site/src/components/KeyboardEventNavigationPrototype.astro` |
| `experiment.transport-timetable` | Transport timetable experiment | no | `site/src/components/transport/TransportTimetableExperiment.astro`<br>`site/src/components/transport/DepartureBoardTimetable.astro`<br>`site/src/components/transport/RouteStripsTimetable.astro`<br>`site/src/components/transport/NextDepartureQueueTimetable.astro` |
| `focus.easter-egg` | Focus easter egg | no | `site/src/components/FocusEggArtifact.astro`<br>`site/src/components/FocusEggCollectionCard.astro`<br>`site/src/components/FocusEggSavedListDemo.astro` |

## evidence_or_lab_only — 2

| ID | Название | Penpot | Source implementations |
|---|---|---:|---|
| `focus.lab-panel` | Focus lab panel | no | `site/src/components/FocusGroupLabPanel.astro` |
| `page.mobile-event-review` | Mobile event review page | no | `site/src/components/lab/MobileEventReviewPage.astro` |

## unresolved_boundary — 3

| ID | Название | Penpot | Source implementations |
|---|---|---:|---|
| `event.list-item` | Event list item boundary | no | `site/src/components/EventListItem.astro` |
| `event.token-medallions` | Event token medallions boundary | no | `site/src/components/EventTokenMedallions.astro` |
| `unresolved.mobile-search-bottom-nav` | Mobile search bottom navigation boundary | no | `site/src/components/MobileSearchBottomNav.astro` |
