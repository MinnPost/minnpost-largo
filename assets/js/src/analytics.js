function mp_analytics_tracking_event( type, category, action, label, value ) {
	if ( typeof ga !== 'undefined' ) {
		if ( typeof value === 'undefined' ) {
			ga( 'send', type, category, action, label );
		} else {
			ga( 'send', type, category, action, label, value );
		}
	} else {
		return;
	}
}