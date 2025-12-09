<x-filament-panels::page>
    <form wire:submit="save">
        {{ $this->form }}

        <x-filament::button type="submit" wire:loading.attr="disabled" style="margin-top: 1rem;">
            Save Settings
        </x-filament::button>
    </form>

    @if(\App\Models\Setting::get('books.temporary_paid_access_mode', false))
        <x-filament::section
            icon="heroicon-o-exclamation-triangle"
            color="warning"
            class="mt-6"
        >
            <x-slot name="heading">
                TEMPORARY PAID ACCESS MODE IS ACTIVE
            </x-slot>

            All books are currently accessible by anyone without purchase verification. Turn off this mode to
            restore normal access control.
        </x-filament::section>
    @endif
</x-filament-panels::page>