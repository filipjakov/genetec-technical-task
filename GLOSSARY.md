# Event Explorer

A demo of three reusable components (DataGrid, Timeline, Event Form) working over a single shared collection of Events.

## Language

**Event**:
A single dated occurrence; the one entity shown by both the DataGrid and the Timeline.
_Avoid_: Row, record, item (when meaning the domain entity)

**Category**:
The kind of security subsystem an Event came from: access, video, intrusion or system.
_Avoid_: Type, kind, source

**Severity**:
How urgently an Event needs an operator's attention, from info to critical.
_Avoid_: Priority, level

**Timeline Window**:
The date range of Events the Timeline renders; a slice of the full Event collection, which the DataGrid shows in full.
_Avoid_: Subset, page

**Day Group**:
The Events of one calendar day, in the viewer's time zone, within the Timeline Window; the Timeline's only level of grouping.
_Avoid_: Section, bucket, date header
